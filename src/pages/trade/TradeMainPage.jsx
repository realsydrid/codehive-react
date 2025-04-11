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
                await new Promise(resolve => setTimeout(resolve, 1000));
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
        staleTime: 1000 * 60 * 5,
        queryFn: async () => {
            const res = await fetch("http://localhost:8801/api/asset/me");
            if (!res.ok) throw new Error(res.status + "");
            return res.json();
        }
    });


    const [combinedData, setCombinedData] = useState([]);

    useEffect(() => {
        // 코인 정보 맵 만들기
        const createCoinInfoMap = () => {
            if (!coinInfo) return {};
            const coinInfoMap = {};
            for (const coin of coinInfo) {
                coinInfoMap[coin.market] = coin;
            }
            return coinInfoMap;
        };

        // 현재 시세 정보 맵 만들기
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

        // '원화' 탭 - 모든 코인 시세 표시
        if (activeTab === "원화" && coinInfo && markets) {
            const combined = markets.map(market => ({
                ...market,
                korean_name: coinInfoMap[market.market]?.korean_name || market.market,
                english_name: coinInfoMap[market.market]?.english_name || ""
            }));

            setCombinedData(combined);
        }
        // '보유' 탭 - 사용자 보유 코인 정보 표시
        else if (activeTab === "보유" && holdingCoins && coinInfo && markets) {
            const combined = holdingCoins
                .filter(holding=>holding.market !== "KRW-KRW")
                .map(holding => {
                const market = marketPriceMap[holding.market];
                const currentPrice = market?.trade_price || 0;
                const averagePrice = holding.averagePrice;

                // 수익/손실 계산
                const priceDifference = currentPrice - averagePrice;
                const changeRate = averagePrice > 0 ? priceDifference / averagePrice : 0;

                // 상승/하락 결정
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

            setCombinedData(combined);
        }
        // '관심' 탭 구현은 생략...

    }, [activeTab, coinInfo, markets, holdingCoins]);

    const navigate = useNavigate();

    const handleRowClick = (market) => {
        navigate(`/trade/order/${market}`);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    return (

        <>


            <div id={"tradeMenuTab"}>
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
                <input type="text" placeholder={"검색"}/>
            </div>

            <table id="tradeMainPageTable">
                <thead>
                <tr>
                    <th>코인명</th>
                    <th>{activeTab === "보유" ? "평가금액" : "현재가"}</th>
                    <th>{activeTab === "보유" ? "평균매수가" : "전일대비"}</th>
                    <th>{activeTab === "보유" ? "수익률" : "거래금액"}</th>
                </tr>
                </thead>
                <tbody>
                {isLoading &&
                    <tr>
                        <td>
                            <Loading/>

                        </td>
                    </tr>
                }
                {error && <ErrorComponent msg={error.message}/>}
                {combinedData && combinedData.map((m) => (
                    activeTab === "보유" ? (
                        <tr key={m.market} onClick={() => handleRowClick(m.market)} className={m.change} id={"myAssetTr"}>
                            <td><p>{m.korean_name}<span>{m.market.split('-').reverse().join('/')}</span></p></td>
                            <td>
                                <p>{formatDecimalsWithCommas(m.currentPrice * m.holdingAmount, 4)} <span>{m.holdingAmount}</span></p>
                            </td>
                            <td>{formatDecimalsWithCommas(m.averagePrice, 4)}</td>
                            <td><p>{formatPercentWithDecimals(m.change_rate)}<span>{formatDecimalsWithCommas(m.change_price)}</span></p></td>
                        </tr>
                    ) : (
                        <tr key={m.market} onClick={() => handleRowClick(m.market)} className={m.change}  id={"currentPriceTr"} >
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