import AssetNavBar from "./AssetNavBar.jsx";
import { useEffect, useState } from "react";
import './AssetPendingOrderPage.css';
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "http://localhost:8801/api/transaction/openOrders";

export default function AssetPendingOrdersPage() {
    const [combinedData, setCombinedData] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const { data: pendingOrders, isPending: isPendingOrdersLoading } = useQuery({
        queryKey: ["pendingOrders"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        queryFn: async () => {
            const res = await fetch(BASE_URL);
            if (!res.ok) throw new Error("미체결 주문 불러오기 실패");
            return res.json();
        }
    });

    const { data: coinInfo, isPending: isCoinInfoLoading } = useQuery({
        queryKey: ["coinInfo"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        queryFn: async () => {
            const res = await fetch("https://api.upbit.com/v1/market/all?is_details=false");
            if (!res.ok) throw new Error("코인 정보 불러오기 실패");
            return res.json();
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

    const deleteOrder = async (url) => {
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) throw new Error("주문 취소에 실패했습니다.");
    };

    const handleCancelAll = async () => {
        const confirm = window.confirm("전체 주문을 취소하시겠습니까?");
        if (!confirm) return;
        try {
            await deleteOrder(`${BASE_URL}/user/1`);
            setCombinedData([]);
        } catch (e) {
            setErrorMsg(e.message);
        }
    };

    const handleCancelOne = async (id) => {
        try {
            await deleteOrder(`${BASE_URL}/id/${id}`);
            setCombinedData(prev => prev.filter(item => item.id !== id));
        } catch (e) {
            setErrorMsg(e.message);
        }
    };

    return (
        <>
            <AssetNavBar />
            <h1 className="pending-orders-title">미체결</h1>

            <button onClick={handleCancelAll} className="cancel-all-button mb-5">
                전체 주문 취소
            </button>

            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            {isPendingOrdersLoading || isCoinInfoLoading ? (
                <p>로딩 중...</p>
            ) : combinedData.length === 0 ? (
                <p>미체결 주문이 없습니다.</p>
            ) : (
                combinedData.map((tx) => (
                    <div key={tx.id} className="order-card">
                        <div className="order-card-header">
                            <strong className="order-market">
                                {tx.koreanName}<br />
                                {tx.market.replace("-", "/")}
                            </strong>
                            <button className="cancel-button" onClick={() => handleCancelOne(tx.id)}>
                                주문 취소
                            </button>
                        </div>
                        <div className="order-card-body">
                            <p>거래 ID : {tx.id}</p>
                            <p className={tx.transactionType === 'BUY' ? "transaction-type-buy" : "transaction-type-sell"}>
                                {tx.transactionType === 'BUY' ? '매수' : '매도'}
                            </p>
                            <p>주문 일자 : {new Date(tx.transactionDate).toLocaleString()}</p>
                            <p>주문 수량 : {tx.transactionCnt.toLocaleString()}</p>
                            <p>주문 금액 : {tx.price.toLocaleString()}</p>
                            <p>정산 금액 : {(tx.price * tx.transactionCnt).toLocaleString()}</p>
                        </div>
                    </div>
                ))
            )}
        </>
    );
}