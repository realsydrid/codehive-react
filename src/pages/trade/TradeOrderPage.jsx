import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {formatDecimalsWithCommas, formatPercentWithDecimals} from "../../utils/numberFormat.js";
import './TradeOrderPage.css';
import Order from "./component/Order.jsx";

export default function TradeOrderPage() {
    const params = useParams();
    const market = params.market;

    const {data: currencyPrice, isLoading: isCurrencyPriceLoading, error: currencyPriceError} = useQuery({
        queryKey: ["currencyPrice",market],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchInterval: 500,
        enabled:!!market,
        queryFn: async () => {

            const URL = "https://api.upbit.com/v1/ticker?markets=" + market;
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if (!res.ok) throw new Error(res.status + "");
                return await res.json();
            } catch (error) {
                throw new Error(error);
            }
        }

    });

    const {data: orderBook, isLoading, error} = useQuery({
        queryKey: ["orderBook",market],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchInterval: 500,
        enabled:!!market,
        queryFn: async () => {

            const URL = "https://api.upbit.com/v1/orderbook?markets=" + market;
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if (!res.ok) throw new Error(res.status + "");
                return await res.json();
            } catch (error) {
                throw new Error(error);
            }
        }

    });

    const {data:coinInfo,isLoading:coinInfoLoading,error:coinInfoError} = useQuery({
        queryKey: ["coinInfo"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        queryFn: async () => {
            const URL="https://api.upbit.com/v1/market/all?is_details=false"
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if (!res.ok) throw new Error(res.status + "");
                return await res.json();
            }catch(error) {
                throw new Error(error);
            }
        }
    })


    const [combinedData, setCombinedData] = useState([]);

    useEffect(() => {
        if (currencyPrice && orderBook && coinInfo) {
            const currentCoinInfo=coinInfo.find(coin=>coin.market===market);
            let combined = [];
            combined = {
                ...orderBook[0],
                trade_price: currencyPrice[0].trade_price,
                change: currencyPrice[0].change,
                change_price: currencyPrice[0].change_price,
                change_rate: currencyPrice[0].change_rate,
                korean_name:currentCoinInfo.korean_name
            };
            setCombinedData(combined);
        }
    }, [currencyPrice, orderBook, isCurrencyPriceLoading,coinInfo]);

    const [activeTab, setActiveTab] = useState("주문");
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };


    return (
        <>
            <ul id={"activeTabNav"}>
                <li className={activeTab === "주문" ? "active" : ""} onClick={()=>handleTabClick("주문")}>주문</li>
                <li className={activeTab === "호가" ? "active" : ""} onClick={()=>handleTabClick("호가")}>호가</li>
                <li className={activeTab === "차트" ? "active" : ""} onClick={()=>handleTabClick("차트")}>차트</li>
                <li className={activeTab === "시세" ? "active" : ""} onClick={()=>handleTabClick("시세")}>시세</li>
                <li className={activeTab === "정보" ? "active" : ""} onClick={()=>handleTabClick("정보")}>정보</li>
            </ul>

            <Order
                combinedData={combinedData}
            />
        </>
    );
}

// function Order({combinedData}) {
//
//
//     return (
//         <>
//
//         {combinedData && combinedData.market ? (
//             <div>
//                 <p>{combinedData.korean_name}(KRW) <span>{combinedData.market.split("-")[1]}</span></p>
//                 <p className={combinedData.change}>{formatDecimalsWithCommas(combinedData.trade_price)} <span>{formatDecimalsWithCommas(combinedData.change_price)}</span> <span>{formatPercentWithDecimals(combinedData.change_rate)}</span></p>
//             </div>
//
//         ):(
//             <div>로딩중~~</div>
//         )}
//         </>
//     )
//
// }