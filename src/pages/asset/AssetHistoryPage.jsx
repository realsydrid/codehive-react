import {Link} from "react-router-dom";
import AssetNavBar from "./AssetNavBar.jsx";
import {useEffect, useState} from "react";

async function loadAssetHistory(){
    try{
    const resp = await fetch("http://localhost:8801/asset/coinTransactions.do")
    if(!resp.ok) throw new Error("통신 실패")
    const data = await resp.json();
    return data.coinTransactions.filter(tx => tx.userNo === 1);
    }catch (error){
        console.log(error)
        return error;
    }
}

export default function AssetHistoryPage() {
    const [coinTransactions, setCoinTransactions] = useState([]);
    useEffect(()=>{
        (async () => {
            const data = await loadAssetHistory();
            setCoinTransactions(data);
        })();
    }, [])
    return (
        <>
            <AssetNavBar />
            <h1>거래내역</h1>
            <table>
                <thead>
                <tr>
                    <th>거래일시</th>
                    <th>자산</th>
                    <th>거래구분</th>
                    <th>거래수량</th>
                    <th>체결가격</th>
                    <th>거래금액</th>
                    <th>상태</th>
                </tr>
                </thead>
                <tbody>
                {
                    coinTransactions.map((tx)=>(
                        <tr key={tx.id}>
                            <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                            <td>{tx.market}</td>
                            <td>{tx.transactionType === "BUY" ? "매수" : "매도"}</td>
                            <td>{tx.transactionCnt}</td>
                            <td>{tx.price.toLocaleString()} 원</td>
                            <td>{(tx.price * tx.transactionCnt).toLocaleString()} 원</td>
                            <td>{tx.transactionState === "COMPLETED" ? "체결완료" : "미체결"}</td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

        </>
    )
}