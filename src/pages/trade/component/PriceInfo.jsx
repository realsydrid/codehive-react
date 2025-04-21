import {useQuery} from "@tanstack/react-query";
import {useState} from "react";

export default function PriceInfo({market}) {
    const [timeTab, setTimeTab] = useState("seconds")


    const handleChangeTab = (time) => {
        setTimeTab(time);
    }


    const {data: candles, isLoading, error} = useQuery({
        queryKey: ["candles", market, timeTab],
        staleTime: timeTab === "seconds" ? 1000 : 1000 * 60 * 15,
        gcTime: timeTab === "seconds" ? 1000 * 60 * 5 : 1000 * 60 * 60* 24,
        retry: 1,
        refetchInterval: timeTab === "seconds" ? 500 : false,
        refetchIntervalInBackground: false,
        queryFn: async () => {
            const URL = `https://api.upbit.com/v1/candles/${timeTab}?market=${market}&count=10`;
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


    return (
        <>
            <ul>
                <li onClick={() => handleChangeTab("seconds")}>시간</li>
                <li onClick={() => handleChangeTab("days")}>일별</li>
            </ul>


            <p>{market}</p>
            <table>
                <thead>
                {timeTab === "seconds" ?
                    (<tr>
                        <th>시간</th>
                        <th>가격(KRW)</th>
                        <th>체결량({market.split('-')[1]})</th>
                    </tr>):(
                        <tr>
                            <th>일자</th>
                            <th>종가(KRW)</th>
                            <th>전일대비</th>
                            <th>거래량({market.split('-')[1]})</th>

                        </tr>
                    )}
                </thead>
                <tbody>

                {candles && (timeTab === "seconds" ? (
                    candles.map((candle, index) => (
                        <tr key={index}>
                            <td>{candle.candle_date_time_kst}</td>
                            <td>{candle.trade_price} 원</td>
                            <td>{candle.candle_acc_trade_volume}</td>
                        </tr>
                    ))
                ) : (
                    candles.map((candle, index) => (
                        <tr key={index}>
                            <td>{candle.candle_date_time_kst}</td>
                            <td>{candle.opening_price} 원</td>
                            <td>{candle.high_price} 원</td>
                            <td>{candle.trade_price} 원</td>
                        </tr>
                    ))
                ))}


                </tbody>
            </table>

        </>
    )

}