import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AssetNavBar from "./AssetNavBar.jsx";
import "./AssetPendingOrderPage.css";
import Toast from "./Toast.jsx";

const API = {
    BASE: "http://localhost:8801/api/transaction/openOrder",
    BY_USER: `http://localhost:8801/api/transaction?userNo=1&transactionState=PENDING`,
    COIN_NAME: "https://api.upbit.com/v1/market/all?is_details=false"
};

export default function AssetPendingOrdersPage() {
    const [combinedData, setCombinedData] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [toastMsg, setToastMsg] = useState("");

    const { data: pendingOrders, isPending: loadingOrders } = useQuery({
        queryKey: ["pendingOrders"],
        queryFn: async () => {
            const res = await fetch(API.BY_USER);
            if (!res.ok) throw new Error("미체결 주문 불러오기 실패");
            return res.json();
        },
        staleTime: 300000,
        cacheTime: 600000,
        retry: 1
    });

    const { data: coinInfo, isPending: loadingInfo } = useQuery({
        queryKey: ["coinInfo"],
        queryFn: async () => {
            const res = await fetch(API.COIN_NAME);
            if (!res.ok) throw new Error("코인 정보 불러오기 실패");
            return res.json();
        },
        staleTime: 300000,
        cacheTime: 600000,
        retry: 1
    });

    useEffect(() => {
        if (!pendingOrders || !coinInfo) return;

        const nameMap = new Map(coinInfo.map(({ market, korean_name }) => [market, korean_name]));

        const merged = (pendingOrders.content || []).map(tx => ({
            ...tx,
            koreanName: nameMap.get(tx.market) || tx.market
        }));

        setCombinedData(merged);
    }, [pendingOrders, coinInfo]);

    const deleteOrder = async (url) => {
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) throw new Error("주문 취소에 실패했습니다.");
    };

    const handleCancelAll = async () => {
        if (!window.confirm("전체 주문을 취소하시겠습니까?")) return;
        try {
            await deleteOrder(`${API.BASE}/user/1`);
            setCombinedData([]);
            setToastMsg("✅ 주문이 취소되었습니다.");
        } catch (e) {
            setErrorMsg(e.message);
        }
    };

    const handleCancelOne = async (id) => {
        try {
            await deleteOrder(`${API.BASE}/${id}`);
            setCombinedData(prev => prev.filter(item => item.id !== id));
            setToastMsg("✅ 주문이 취소되었습니다.");
        } catch (e) {
            setErrorMsg(e.message);
        }
    };

    if (loadingOrders || loadingInfo) return <p>로딩 중...</p>;
    if (errorMsg) return <p className="error-msg">{errorMsg}</p>;

    return (
        <>
            <AssetNavBar />
            <h1 className="pending-orders-title">미체결</h1>

            <button onClick={handleCancelAll} className="cancel-all-button mb-5 mt-5">
                전체 주문 취소
            </button>

            {combinedData.length === 0 ? (
                <p>미체결 주문이 없습니다.</p>
            ) : (
                combinedData.map(tx => (
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
                            <p>주문 일자 : {new Date(tx.transactionDate).toLocaleString('ko-KR')}</p>
                            <p>주문 수량 : {tx.transactionCnt.toLocaleString()}</p>
                            <p>주문 금액 : {tx.price.toLocaleString()}</p>
                            <p>정산 금액 : {(tx.price * tx.transactionCnt).toLocaleString()}</p>
                        </div>
                    </div>
                ))
            )}
            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        </>
    );
}