import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {formatDecimalsWithCommas, formatPercentWithDecimals} from "../../utils/numberFormat.js";
import './TradeOrderPage.css';
import Order from "./component/Order.jsx";
import Chart from "./component/Chart.jsx";
import OrderBook from "./component/OrderBook.jsx";
import PriceInfo from "./component/PriceInfo.jsx";
import CoinDetailInfo from "./component/CoinDetailInfo.jsx";
import CoinTitle from "./component/CoinTitle.jsx";

export default function TradeOrderPage() {
    const params = useParams();
    const market = params.market;
    // const ServerUrl="http://localhost:8801";
    const ServerUrl="";

    const {data: currencyPrice, isLoading: isCurrencyPriceLoading, error: currencyPriceError} = useQuery({
        queryKey: ["currencyPrice", market],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchInterval: 500,
        enabled: !!market,
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
        queryKey: ["orderBook", market],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        refetchInterval: 500,
        enabled: !!market,
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

    const {data: coinInfo, isLoading: isCoinInfoLoading, error: coinInfoError} = useQuery({
        queryKey: ["coinInfo"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        queryFn: async () => {
            const URL = "https://api.upbit.com/v1/market/all?is_details=false"
            try {
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if (!res.ok) throw new Error(res.status + "");
                return await res.json();
            } catch (error) {
                throw new Error(error);
            }
        }
    })

    const [combinedData, setCombinedData] = useState([]);

    useEffect(() => {
        if (currencyPrice && orderBook && coinInfo) {
            const currentCoinInfo = coinInfo.find(coin => coin.market === market);
            let combined = [];
            combined = {
                ...orderBook[0],
                trade_price: currencyPrice[0].trade_price,
                change: currencyPrice[0].change,
                change_price: currencyPrice[0].change_price,
                change_rate: currencyPrice[0].change_rate,
                signed_change_rate: currencyPrice[0].signed_change_rate,
                acc_trade_price_24h: currencyPrice[0].acc_trade_price_24h,
                highest_52_week_price: currencyPrice[0].highest_52_week_price,
                highest_52_week_date: currencyPrice[0].highest_52_week_date,
                lowest_52_week_price: currencyPrice[0].lowest_52_week_price,
                lowest_52_week_date: currencyPrice[0].lowest_52_week_date,
                prev_closing_price: currencyPrice[0].prev_closing_price,
                high_price: currencyPrice[0].high_price,
                low_price: currencyPrice[0].low_price,
                korean_name: currentCoinInfo.korean_name,
                english_name: currentCoinInfo.english_name,
            };
            setCombinedData(combined);
        }
    }, [currencyPrice, orderBook, isCurrencyPriceLoading, coinInfo]);

    const [activeTab, setActiveTab] = useState("주문");
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        if (isCurrencyPriceLoading || isLoading || isCoinInfoLoading) {
            return <div>로딩 중...</div>;
        }

        switch (activeTab) {
            case "주문":
                return <Order market={market} combinedData={combinedData} orderBook={orderBook} />;
            case "호가":
                return <OrderBook market={market} orderBook={orderBook} combinedData={combinedData} />;
            case "차트":
                return <Chart market={market} combinedData={combinedData} />;
            case "시세":
                return <PriceInfo market={market} change={combinedData.change} />;
            case "정보":
                return <CoinDetailInfo combinedData={combinedData} market={market} />;
            default:
                return <Order market={market} combinedData={combinedData} />;
        }
    };

    return (
        <>
            <CoinTitle combinedData={combinedData} />
            <ul className="tradeOrder-activeTabNav">
                <li className={activeTab === "주문" ? "active" : ""} onClick={() => handleTabClick("주문")}>주문</li>
                <li className={activeTab === "호가" ? "active" : ""} onClick={() => handleTabClick("호가")}>호가</li>
                <li className={activeTab === "차트" ? "active" : ""} onClick={() => handleTabClick("차트")}>차트</li>
                <li className={activeTab === "시세" ? "active" : ""} onClick={() => handleTabClick("시세")}>시세</li>
                <li className={activeTab === "정보" ? "active" : ""} onClick={() => handleTabClick("정보")}>정보</li>
            </ul>

            {renderTabContent()}
        </>
    );
}

