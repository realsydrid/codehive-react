import AssetNavBar from "./AssetNavBar.jsx";
import {useEffect,useState} from "react";
import './AssetPendingOrderPage.css'
import {useQuery} from "@tanstack/react-query";

export default function AssetPendingOrdersPage() {
    const [combinedData, setCombinedData] = useState([]);
    const {data: pendingOrders,
        isPendingOrdersLoading,
        isPendingOrdersError,
        refetch: refetchPendingOrders} = useQuery({
        queryKey:["pendingOrders"],
        staleTime:1000*60*5,
        cacheTime:1000*60*10,
        retry:1,
        queryFn: async ()=>{
            const URL = "http://localhost:8801/api/asset/openOrders";
            try{
                await new Promise(resolve => setTimeout(resolve, 0));
                const res= await fetch(URL);
                if(!res.ok) throw new Error(res.status+ "");
                return res.json();
            }catch(error){
                console.log(error);
            }
        }
    });

    const {data: coinInfo, isLoading, error} = useQuery({
        queryKey:["coinInfo"],
        staleTime:1000*60*5,
        cacheTime:1000*60*10,
        retry:1,
        queryFn: async ()=>{
            const URL = "https://api.upbit.com/v1/market/all?is_details=false";
            try{
                await new Promise(resolve => setTimeout(resolve, 0));
                const res= await fetch(URL);
                if(!res.ok) throw new Error(res.status+ "");
                return res.json();

            }catch(error){
                console.log(error);
            }
        }
    });

    useEffect(() => {
        if (pendingOrders && coinInfo) {
            const map = new Map();
            coinInfo.forEach((coin) => {
                map.set(coin.market, coin.korean_name);
            });

            const merged = (pendingOrders.coinTransactions || []).map(tx => ({
                ...tx,
                koreanName: map.get(tx.market) || tx.market
            }));

            setCombinedData(merged);
        }
    }, [pendingOrders, coinInfo]);


    return (
        <>
            <AssetNavBar />
            <h1 className={"pending-orders-title"}>미체결</h1>
            <button onClick={async () =>{
                try{
                    const res = await fetch(`http://localhost:8801/api/asset/openOrders/user/1`,{
                        method:"DELETE"
                    });
                    if(!res.ok) throw new Error("주문 취소에 실패했습니다.");
                    setCombinedData([]);
                }catch (e){
                    alert("주문 취소 중 오류가 발생:" + e.message);
                }
            }} className={"cancel-all-button"}>전체 삭제</button>
            {
                combinedData.length === 0 ? (
                    <p>미체결 주문이 없습니다.</p>
                ) : (
                    combinedData.map((tx) => (
                        <div key={tx.id} className="order-card">
                            <div className="order-card-header">
                                <strong className="order-market">{tx.koreanName}<br/>
                                    {tx.market.replace("-","/")}</strong>
                                <button className="cancel-button" onClick={async () => {
                                    try {
                                        const res = await fetch(`http://localhost:8801/api/asset/openOrders/id/${tx.id}`,{
                                            method: "DELETE"
                                        });
                                        if (!res.ok) throw new Error("주문 취소에 실패하였습니다.");
                                        setCombinedData(prev => prev.filter(item => item.id !== tx.id));
                                    }catch (e) {
                                        alert("주문 취소 중 오류가 발생:" + e.message);
                                    }
                                }}>주문 취소</button>
                            </div>
                            <p>거래 ID : {tx.id}</p>
                            <p className={tx.transactionType === 'BUY' ? "transaction-type-buy" : "transaction-type-sell"}>
                                {tx.transactionType === 'BUY' ? '매수' : '매도'}
                            </p>
                            <p>주문 일자 : {new Date(tx.transactionDate).toLocaleString()}</p>
                            <p>주문 수량 : {(tx.transactionCnt).toLocaleString()}</p>
                            <p>주문 금액 : {tx.price.toLocaleString()}</p>
                            <p>정산 금액 : {(tx.price * tx.transactionCnt).toLocaleString()}</p>
                        </div>
                    ))
                )
            }
        </>
    )
}
