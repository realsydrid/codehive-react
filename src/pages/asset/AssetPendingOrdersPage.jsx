import {Link} from "react-router-dom";
import AssetNavBar from "./AssetNavBar.jsx";
import {useEffect,useState} from "react";

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
            <h1>미체결</h1>
            {
                coinTransactions.map((tx) => (
                    <div key={tx.id}>
                        <p>코인명 : {tx.market}</p>
                        <p>{tx.transactionType}</p>
                        <p>주문 일자 : {new Date(tx.transactionDate).toLocaleString()}</p>
                        <p>주문 수량 : {tx.transactionCnt}</p>
                        <p>주문 금액 : {tx.price}</p>
                        <hr/>
                    </div>
                ))
            }
        </>
    )
}