import {useQuery} from "@tanstack/react-query";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    formatDecimalsWithCommas,
    formatMillionsWithCommas,
    formatPercentWithDecimals
} from "../../utils/numberFormat.js"
import './TradeMainPage.css';

export default function TradeMainPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [originalData, setOriginalData] = useState([]);
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const [activeTab, setActiveTab] = useState("원화");

    const {data: markets, isLoading, error} = useQuery({
        queryKey: ["markets"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchInterval: 500,
        queryFn: async () => {
            const URL = "https://api.upbit.com/v1/ticker/all?quote_currencies=KRW";
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if (!res.ok) throw new Error(res.status + "");
                return res.json();
            } catch (error) {
                throw new Error(error);
            }
        }
    });

    const {data: coinInfo, isLoading: coinInfoLoading} = useQuery({
        queryKey: ["coinInfo"],
        staleTime: 1000 * 60 * 60,
        queryFn: async () => {
            const res = await fetch("https://api.upbit.com/v1/market/all?isDetails=false");
            if (!res.ok) throw new Error(res.status + "");
            return res.json();
        }
    });

    const {data: holdingCoins, isLoading: holdingCoinsLoading, error: holdingCoinsError} = useQuery({
        queryKey: ["holdingCoins"],
        enabled: activeTab === "보유",
        staleTime: 0,
        retry: 3,
        queryFn: async () => {
            const res = await fetch("http://localhost:8801/api/asset/me");
            if (!res.ok) throw new Error(res.status + "");
            return res.json();
        }
    });

    const {data: favoriteCoins, isLoading: favoriteCoinsLoading, error: favoriteCoinsError} = useQuery({
        queryKey: ["favoriteCoins"],
        enabled: activeTab === "관심",
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const res = await fetch("http://localhost:8801/api/favorites/me");
            if (!res.ok) throw new Error(res.status + "");
            return res.json();
        }
    })

    const [combinedData, setCombinedData] = useState([]);

    useEffect(() => {
        if (activeTab === "보유" && (holdingCoinsError || holdingCoinsLoading)) {
            setOriginalData([]);
            setCombinedData([]);
            return;
        }

        const createCoinInfoMap = () => {
            if (!coinInfo) return {};
            const coinInfoMap = {};
            for (const coin of coinInfo) {
                coinInfoMap[coin.market] = coin;
            }
            return coinInfoMap;
        };

        const createMarketPriceMap = () => {
            if (!markets) return {};
            const marketPriceMap = {};
            for (const market of markets) {
                marketPriceMap[market.market] = market;
            }
            return marketPriceMap;
        };

        const coinInfoMap = createCoinInfoMap();
        const marketPriceMap = createMarketPriceMap();

        let combined = [];

        if (activeTab === "원화" && coinInfo && markets) {
            combined = markets.map(market => ({
                ...market,
                korean_name: coinInfoMap[market.market]?.korean_name || market.market,
                english_name: coinInfoMap[market.market]?.english_name || ""
            }));
        }
        // 보유
        else if (activeTab === "보유" && holdingCoins && coinInfo && markets) {
            combined = holdingCoins
                .filter(holding => holding.market !== "KRW-KRW")
                .map(holding => {
                    const market = marketPriceMap[holding.market];
                    const currentPrice = market?.trade_price || 0;
                    const averagePrice = holding.averagePrice;

                    const priceDifference = currentPrice - averagePrice;
                    const changeRate = averagePrice > 0 ? priceDifference / averagePrice : 0;

                    let change = 'EVEN';
                    if (priceDifference > 0) change = 'RISE';
                    else if (priceDifference < 0) change = 'FALL';

                    return {
                        market: holding.market,
                        korean_name: coinInfoMap[holding.market]?.korean_name || holding.market,
                        holdingAmount: holding.holdingAmount,
                        averagePrice: averagePrice,
                        currentPrice: currentPrice,
                        change: change,
                        change_price: Math.abs(priceDifference),
                        change_rate: Math.abs(changeRate),
                    };
                });
        } else if (activeTab === "관심" && favoriteCoins && coinInfo && markets) {
            const filteredCoins = markets.filter(market => favoriteCoins.includes(market.market));
            combined = filteredCoins.map(market => ({
                ...market,
                korean_name: coinInfoMap[market.market]?.korean_name || market.market,
                english_name: coinInfoMap[market.market]?.korean_name || ""
            }))
        }
        setOriginalData(combined);
    }, [activeTab, coinInfo, markets, holdingCoins, holdingCoinsError, favoriteCoins]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setCombinedData(originalData);
        } else {
            const filtered = originalData.filter(item => item.korean_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.market.toLowerCase().includes(searchTerm.toLowerCase()));
            setCombinedData(filtered);
        }
    }, [searchTerm, originalData]);

    const navigate = useNavigate();

    const handleRowClick = (market) => {
        navigate(`/trade/order/${market}`);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className="tradeMain-menuTab">
                <ul>
                    <li
                        className={activeTab === "원화" ? "active" : ""}
                        onClick={() => handleTabClick("원화")}
                    >
                        원화
                    </li>
                    <li
                        className={activeTab === "보유" ? "active" : ""}
                        onClick={() => handleTabClick("보유")}
                    >
                        보유
                    </li>
                    <li
                        className={activeTab === "관심" ? "active" : ""}
                        onClick={() => handleTabClick("관심")}
                    >
                        관심
                    </li>
                </ul>
                <input type="text" placeholder={"검색"} value={searchTerm} onChange={handleSearchChange} />
            </div>

            <table className="tradeMain-table">
                <colgroup>
                    {activeTab === "보유" ? (
                        <>
                            <col style={{width: "25%"}}/>
                            <col style={{width: "25%"}}/>
                            <col style={{width: "30%"}}/>
                            <col style={{width: "20%"}}/>
                        </>
                    ) : (
                        <>
                            <col style={{width: "25%"}}/>
                            <col style={{width: "30%"}}/>
                            <col style={{width: "20%"}}/>
                            <col style={{width: "25%"}}/>
                        </>
                    )}
                </colgroup>
                <thead>
                <tr>
                    <th>코인명</th>
                    <th>{activeTab === "보유" ? "평가금액" : "현재가"}</th>
                    <th>{activeTab === "보유" ? "평균매수가" : "전일대비"}</th>
                    <th>{activeTab === "보유" ? "수익률" : "거래금액"}</th>
                </tr>
                </thead>
                <tbody>
                {(isLoading || holdingCoinsLoading) &&
                    <tr>
                        <td>
                            <Loading/>
                        </td>
                    </tr>
                }
                {error && <ErrorComponent msg={error.message}/>}
                {holdingCoinsError && <ErrorComponent msg={holdingCoinsError.message}/>}
                {favoriteCoinsError && <ErrorComponent msg={favoriteCoinsError.message}/>}
                {combinedData && combinedData.map((m) => (
                    activeTab === "보유" ? (
                        <tr key={m.market} onClick={() => handleRowClick(m.market)} className={`${m.change} tradeMain-myAssetTr`}>
                            <td><p>{m.korean_name}<span>{m.market.split('-').reverse().join('/')}</span></p></td>
                            <td>
                                <p>{formatDecimalsWithCommas(m.currentPrice * m.holdingAmount, 4)}
                                    <span>{m.holdingAmount}</span></p>
                            </td>
                            <td>{formatDecimalsWithCommas(m.averagePrice, 1)}</td>
                            <td>
                                <p>{formatPercentWithDecimals(m.change_rate)}<span>{formatDecimalsWithCommas(m.change_price)}</span>
                                </p></td>
                        </tr>
                    ) : (
                        <tr key={m.market} onClick={() => handleRowClick(m.market)} className={`${m.change} tradeMain-currentPriceTr`}>
                            <td>
                                <p>{m.korean_name}<span>{m.market.split('-').reverse().join('/')}</span></p>
                            </td>
                            <td>{formatDecimalsWithCommas(m.trade_price, 4)}</td>
                            <td>
                                <p>{formatPercentWithDecimals(m.change_rate)}<span>{m.change_price}</span></p>
                            </td>
                            <td>{formatMillionsWithCommas(m.acc_trade_price_24h)}<span>백만</span></td>
                        </tr>
                    )
                ))}
                </tbody>
            </table>
        </>
    );
}

function Loading() {
    return <p>Loading...</p>;
}

function ErrorComponent({msg}) {
    return <p style={{color: "red"}}>{msg}</p>;
}