import AssetNavBar from "./AssetNavBar.jsx";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import "./AssetMyAssetPage.css"

export default function AssetMyAssetPage(){
    const [combinedData, setCombinedData] = useState([]);
    const [totalEval, setTotalEval] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalProfitRate, setTotalProfitRate] = useState(0);

    const {data: krwBalance,
    isKrwBalanceLoading,
    isKrwBalanceError,
    refetch: refetchKrwBalance} = useQuery({
        queryKey: ["krwBalance"],
        staleTime: 1000*60*5,
        cacheTime: 1000*60*10,
        retry: 1,
        queryFn: async () =>{
            const URL = "http://localhost:8801/api/transaction/home"
            try{
                await new Promise(resolve => setTimeout(resolve, 0));
                const res = await fetch(URL);
                if(!res.ok)throw new Error(res.status+"");
                return res.json();
            }catch (error){
                console.error(error);
            }
        }
    });

    const { data: coinPrice, isLoading, error } = useQuery({
        queryKey: ["coinPrice"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        queryFn: async () => {
            const res = await fetch("https://api.upbit.com/v1/ticker/all?quote_currencies=KRW,BTC");
            if (!res.ok) throw new Error(res.status + "");
            const json = await res.json();
            return json.map(({ market, trade_price }) => ({ market, trade_price }));
        }
    });


    useEffect(() => {

        if(!krwBalance || !coinPrice) return;

        const map = new Map();
        coinPrice.forEach(({market, trade_price}) => {
            map.set(market, trade_price);
        });

        let totalEvalValue = 0;
        let totalBuyValue = 0;

        const evaluated = krwBalance.map(item => {
            const currentPrice = map.get(item.market);
            const holdingAmount = item.holdingAmount;
            const averagePrice = item.averagePrice;

            const buyValue = averagePrice * holdingAmount;
            const evalValue = currentPrice != null ? currentPrice * holdingAmount : 0;
            const profit = evalValue - buyValue;
            const profitRate = buyValue !==0 ? (profit / buyValue) * 100 : 0;

            if (item.market !== "KRW-KRW") {
                totalEvalValue += evalValue;
                totalBuyValue += buyValue;
            } else {
                totalEvalValue += evalValue;
            }

            return {
                ...item,
                currentPrice,
                buyValue,
                evalValue,
                profit,
                profitRate
            }
        });
        setCombinedData(evaluated);
        setTotalEval(totalEvalValue);
        setTotalProfit(totalEvalValue - totalBuyValue);
        setTotalProfitRate(totalBuyValue !== 0 ? ((totalEvalValue - totalBuyValue) / totalBuyValue) * 100 : 0);
    }, [krwBalance,coinPrice]);

    return (
        <>
            <AssetNavBar />
            <h1>보유자산 홈</h1>

            <div className="asset-summary">
                <h2>{totalEval.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원</h2>
                <p><strong>평가손익 :</strong>
                     <span style={{ color: totalProfit >= 0 ? 'red' : 'blue' }}>
        {totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원
        </span>
                </p>
                <p><strong>수익률 :</strong>
                     <span style={{ color: totalProfitRate >= 0 ? 'red' : 'blue' }}>
        {totalProfitRate.toLocaleString(undefined, { maximumFractionDigits: 2 })} %
        </span>
                </p>
                <button>보유자산 초기화하기</button>
            </div>

            <div className="asset-card-container">
                {combinedData
                    .filter(item => item.market !== "KRW-KRW")
                    .map((item, idx) => (
                        <div className="asset-card" key={idx}>
                            <p><strong>{item.market}</strong></p>
                            <p>
                                평가손익 : <span className={item.profit >= 0 ? 'red' : 'blue'}>
  {item.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원
</span>
                            </p>
                            <p>
                                수익률 : <span style={{ color: item.profitRate >= 0 ? 'red' : 'blue' }}>
                    {item.profitRate.toLocaleString(undefined, { maximumFractionDigits: 2 })} %
                </span>
                            </p>
                            <p>보유 수량: {item.holdingAmount.toLocaleString()}</p>
                            <p>평균 매수가: {item.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} 원</p>
                            <p>평가 금액: {item.evalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원</p>
                            <p>매수 금액: {item.buyValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원</p>
                        </div>
                    ))}
            </div>
        </>
    )
}