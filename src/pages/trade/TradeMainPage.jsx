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
    const {data: markets, isLoading, error} = useQuery({
        queryKey: ["markets"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchInterval: 500,
        queryFn: async () => {
            const URL = "https://api.upbit.com/v1/ticker/all?quote_currencies=KRW";
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
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

    const [combinedData, setCombinedData] = useState([]);

    useEffect(() => {
        if (coinInfo && markets) {

            const coinInfoMap = {};
            for (const coin of coinInfo) {
                coinInfoMap[coin.market] = coin;
            }


            const combined = markets.map(market => ({
                ...market,
                korean_name: coinInfoMap[market.market]?.korean_name || market.market,
                english_name: coinInfoMap[market.market]?.english_name || ""
            }));

            setCombinedData(combined);
        }
    }, [coinInfo, markets]);

    const navigate = useNavigate();

    const handleRowClick = (market) => {
        navigate(`/trade/order/${market}`);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    const [activeTab, setActiveTab] = useState("원화");

    return (

        <>

            {isLoading && <Loading/>}
            {error && <ErrorComponent msg={error.message}/>}
            <div  id={"tradeMenuTab"}>
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
                    <th>현재가</th>
                    <th>전일대비</th>
                    <th>거래금액</th>
                </tr>
                </thead>
                <tbody>
                {combinedData && combinedData.map((m) =>

                    <tr key={m.market} onClick={() => handleRowClick(m.market)} style={{cursor: 'pointer'}}
                        className={m.change}>
                        <td>
                            <p>{m.korean_name}<span>{m.market.split('-').reverse().join('/')}</span></p>

                        </td>
                        <td>{formatDecimalsWithCommas(m.trade_price,4)}</td>
                        <td>
                            <p>{formatPercentWithDecimals(m.change_rate)}<span>{m.change_price}</span></p>

                        </td>
                        <td>{formatMillionsWithCommas(m.acc_trade_price_24h)}<span>백만</span></td>
                    </tr>
                )}
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