import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AssetNavBar from "./AssetNavBar.jsx";
import './AssetHistoryPage.css';

export default function LoadAssetHistory() {
    const [combinedData, setCombinedData] = useState([]);

    const { data: coinTransaction, isLoading: isLoading1, isError: isError1 } = useQuery({
        queryKey: ["coinTransaction"],
        queryFn: async () => {
            const res = await fetch("http://localhost:8801/api/asset/coinTransactions.do");
            if (!res.ok) throw new Error("거래 내역 불러오기 실패");
            return res.json();
        }
    });

    const { data: coinInfo, isLoading: isLoading2, isError: isError2 } = useQuery({
        queryKey: ["coinInfo"],
        queryFn: async () => {
            const res = await fetch("https://api.upbit.com/v1/market/all?is_details=false");
            if (!res.ok) throw new Error("코인 정보 불러오기 실패");
            return res.json();
        }
    });

    useEffect(() => {
        if (coinTransaction && coinInfo) {
            const map = new Map();
            coinInfo.forEach((coin) => {
                map.set(coin.market, coin.korean_name);
            });

            const merged = (coinTransaction.coinTransactions || []).map(tx => ({
                ...tx,
                koreanName: map.get(tx.market) || tx.market
            }));

            setCombinedData(merged);
        }
    }, [coinTransaction, coinInfo]);

    if (isLoading1 || isLoading2) return <p>로딩 중...</p>;
    if (isError1 || isError2) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

    return (
        <>
            <AssetNavBar />
            <div className="asset-history-container">
                <h1 className="asset-history-title">거래내역</h1>
                <table className="asset-history-table">
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
                    {combinedData.map((tx) => (
                        <tr key={tx.id}>
                            <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                            <td className="asset-type">
                                {tx.koreanName}<br />{tx.market.replace("-", "/")}
                            </td>
                            <td className={tx.transactionType === "BUY" ? "transaction-type-buy" : "transaction-type-sell"}>
                                {tx.transactionType === "BUY" ? "매수" : "매도"}
                            </td>
                            <td>{tx.transactionCnt}</td>
                            <td>{tx.price.toLocaleString()} 원</td>
                            <td>{(tx.price * tx.transactionCnt).toLocaleString()} 원</td>
                            <td className={tx.transactionState === "COMPLETED" ? "transaction-status-completed" : "transaction-status-pending"}>
                                {tx.transactionState === "COMPLETED" ? "체결완료" : "미체결"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
