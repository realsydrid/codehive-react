import AssetNavBar from "./AssetNavBar.jsx";
import {useEffect,useState} from "react";
import './AssetPendingOrderPage.css'

async function loadOpenOrders(){
    try{
        const response = await fetch("http://localhost:8801/asset/openOrders.do")
        if(!response.ok) throw new Error("통신 실패")
        const data = await response.json();
        return data.coinTransactions || [];
    } catch (error){
        console.log(error)
        return [];
    }
}

export default function AssetPendingOrdersPage() {
    const [coinTransactions, setCoinTransactions] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await loadOpenOrders();
            setCoinTransactions(data);
        })();
    },[])

    return (
        <>
            <AssetNavBar />
            <h1 className={"pending-orders-title"}>미체결</h1>
            {
                coinTransactions.length === 0 ? (
                    <p>미체결 주문이 없습니다.</p>
                ) : (
                    coinTransactions.map((tx) => (
                        <div key={tx.id} className="order-card">
                            <div className="order-card-header">
                                <strong className="order-market">{tx.market}</strong>
                                <button className="cancel-button">주문 취소</button>
                            </div>
                        <p>{tx.transactionType}</p>
                        <p>주문 일자 : {new Date(tx.transactionDate).toLocaleString()}</p>
                        <p>주문 수량 : {tx.transactionCnt}</p>
                        <p>주문 금액 : {tx.price}</p>
                        <p>정산 금액 : {tx.price * tx.transactionCnt}</p>
                    </div>
                ))
                )
            }
        </>
    )
}