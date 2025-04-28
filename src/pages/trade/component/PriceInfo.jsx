import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import './PriceInfo.css'
import {formatDecimalsWithCommas, formatPercentWithDecimals} from "../../../utils/numberFormat.js";

export default function PriceInfo({market,change}) {
    const [timeTab, setTimeTab] = useState("seconds")


    const handleChangeTab = (time) => {
        setTimeTab(time);
    }


    const {data: candles, isLoading, error} = useQuery({
        queryKey: ["candles", market, timeTab],
        staleTime: timeTab === "seconds" ? 1000 : 1000 * 60 * 15,
        gcTime: timeTab === "seconds" ? 1000 * 60 * 5 : 1000 * 60 * 60 * 24,
        retry: 1,
        refetchInterval: timeTab === "seconds" ? 500 : 500,
        refetchIntervalInBackground: false,
        queryFn: async () => {
            const URL = `https://api.upbit.com/v1/candles/${timeTab}?market=${market}&count=200`;
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

    const {data: secondsPriceInfo, isSecondsPriceInfoLoading,isSecondsPriceInfoError} =useQuery({
        queryKey: ["secondsPriceInfo", market],
        staleTime : 1000,
        gcTime : 1000 * 60 *5,
        retry: 1,
        refetchInterval : 500,
        queryFn: async () => {
            const URL= `https://api.upbit.com/v1/trades/ticks?market=${market}&count=200`
            try{
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if (!res.ok) throw new Error(res.status + "");
                return res.json();
            }catch(error) {
                throw new Error(error);
            }
        }
    });


    return (
        <>
            <ul className="priceInfo-tab">
                <li onClick={() => handleChangeTab("seconds")} className={timeTab === "seconds" && "active"}>시간</li>
                <li onClick={() => handleChangeTab("days")} className={timeTab === "days" && "active"}>일별</li>
            </ul>



            <table className="priceInfo-table">
                <thead>
                {timeTab === "seconds" ?
                    (<tr className={"priceInfo-thead-row-seconds"}>
                        <th>시간</th>
                        <th>가격(KRW)</th>
                        <th>체결량({market.split('-')[1]})</th>
                    </tr>) : (
                        <tr className={"priceInfo-thead-row-days"}>
                            <th>일자</th>
                            <th>종가(KRW)</th>
                            <th>전일대비</th>
                            <th>거래량({market.split('-')[1]})</th>

                        </tr>
                    )}
                </thead>
                <tbody>

                {candles && secondsPriceInfo && (timeTab === "seconds" ? (
                    secondsPriceInfo.map((candle, index) => (
                        <tr key={index} className={"priceInfo-tbody-row-seconds"}>
                            <td>{candle.trade_time_utc}</td>
                            <td className={change}>{candle.trade_price} 원</td>
                            <td className={candle.ask_bid ==="BID" ? "RISE" : "FALL"}>{candle.trade_volume}</td>
                        </tr>
                    ))
                ) : (
                    candles.map((candle, index) => (
                        <tr key={index} className={"priceInfo-tbody-row-days"}>
                            <td>{candle.candle_date_time_kst.split('T')[0].split('-')[1]+"."+candle.candle_date_time_kst.split('T')[0].split('-')[2]}</td>
                            <td className={candle.trade_price>candle.opening_price ? "RISE" : "FALL"} >{candle.trade_price} 원</td>
                            <td className={candle.trade_price>candle.opening_price ? "RISE" : "FALL"}> {formatPercentWithDecimals(candle.change_rate)}<span>{candle.change_price}</span></td>
                            <td>{formatDecimalsWithCommas(candle.candle_acc_trade_volume)}</td>
                        </tr>
                    ))
                ))}


                </tbody>
            </table>

        </>
    )

}