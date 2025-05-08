import AssetNavBar from "./AssetNavBar.jsx";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./AssetMyAssetPage.css";
import PortfolioDonutChart from "./PortfolioChart.jsx";
import { formatDecimalsWithCommas } from "../../utils/numberFormat.js";
import { useNavigate, Navigate } from "react-router-dom";
import Toast from "./Toast.jsx";
import Swal from "sweetalert2";

const API = {
    BASE: "http://localhost:8801/api/transaction",
    BY_ME: "http://localhost:8801/api/transaction/me",
    COIN_PRICE: "https://api.upbit.com/v1/ticker/all?quote_currencies=KRW,BTC",
    COIN_NAME: "https://api.upbit.com/v1/market/all?is_details=false"
};

export default function AssetMyAssetPage() {
    const [combinedData, setCombinedData] = useState([]);
    const [summary, setSummary] = useState({ eval: 0, profit: 0, rate: 0 });
    const [formData, setFormData] = useState({ amount: 1000000 });
    const [showForm, setShowForm] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [chartData, setChartData] = useState([]);
    const [toastMsg, setToastMsg] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");

    if (!token) {
        return <Navigate to="/login" />;
    }

    const headers = {
        Authorization : `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    const isAssetCleared = summary.eval === 0 && combinedData.length === 0;

    const { data: krwBalance, refetch: refetchKrwBalance, isPending: loadingBalance } = useQuery({
        queryKey: ["krwBalance"],
        queryFn: () =>
            fetch(API.BY_ME, { headers }).then(res => {
                if (!res.ok) throw new Error("자산 조회 실패");
                return res.json();
            })
    });

    const { data: coinPrice, isPending: loadingPrice } = useQuery({
        queryKey: ["coinPrice"],
        queryFn: async () => {
            const res = await fetch(API.COIN_PRICE);
            if (!res.ok) throw new Error("코인 가격 실패");
            const data = await res.json();
            return data.map(({ market, trade_price }) => ({ market, trade_price }));
        },
        staleTime: 0,
        refetchInterval: 500
    });

    const { data: coinInfo, isPending: loadingInfo } = useQuery({
        queryKey: ["coinInfo"],
        queryFn: () => fetch(API.COIN_NAME).then(res => res.json())
    });

    useEffect(() => {
        if (!krwBalance || !coinPrice || !coinInfo) return;

        const priceMap = new Map(coinPrice.map(({ market, trade_price }) => [market, trade_price]));
        const nameMap = new Map(coinInfo.map(({ market, korean_name }) => [market, korean_name]));

        let totalEval = 0, totalBuy = 0, totalProfit = 0;

        const evaluated = krwBalance.map(item => {
            const { market, holdingAmount, averagePrice } = item;
            const isKRW = market === "KRW-KRW";
            const currentPrice = isKRW ? averagePrice : priceMap.get(market);
            const buyValue = averagePrice * holdingAmount;
            const evalValue = (currentPrice ?? 0) * holdingAmount;
            const profit = isKRW ? 0 : evalValue - buyValue;
            const profitRate = isKRW || buyValue === 0 ? 0 : (profit / buyValue) * 100;

            totalEval += evalValue;
            if (!isKRW) {
                totalBuy += buyValue;
                totalProfit += profit;
            }

            return {
                ...item,
                currentPrice,
                buyValue,
                evalValue,
                profit,
                profitRate,
                koreanName: nameMap.get(market)
            };
        });

        setCombinedData(evaluated);
        setSummary({
            eval: totalEval,
            profit: totalProfit,
            rate: totalBuy !== 0 ? (totalProfit / totalBuy) * 100 : 0
        });
    }, [krwBalance, coinPrice, coinInfo]);

    useEffect(() => {
        if (!krwBalance || !coinInfo) return;

        const chartReady = krwBalance
            .filter(item => item.market !== "KRW-KRW" && item.holdingAmount > 0)
            .map(item => ({
                market: item.market,
                evalValue: item.averagePrice * item.holdingAmount
            }));

        setChartData(chartReady);
    }, [krwBalance, coinInfo]);

    useEffect(() => {
        refetchKrwBalance();
    }, []);

    const deleteAll = async () => {
        const res = await fetch(API.BY_ME, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error("초기화 실패");
    };

    const handleReset = async () => {
        const result = await Swal.fire({
            title: "정말 초기화할까요?",
            text: "이 작업은 되돌릴 수 없습니다!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "초기화",
            cancelButtonText: "취소"
        });

        if (result.isConfirmed) {
            await deleteAll();
            await refetchKrwBalance();
            setToastMsg("보유자산이 초기화되었습니다.");
        }
    };

    const handleRegister = async () => {
        const min = 1_000_000;
        const max = 100_000_000;
        const amount = formData.amount;

        // 🔒 클라이언트 유효성 검사
        if (amount < min || amount > max) {
            setToastMsg("❗️보유자산은 최소 100만원, 최대 1억원까지만 입력 가능합니다.");
            return;
        }

        const date = new Date();
        const kstISOString = new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().replace("Z", "");

        const payload = {
            market: "KRW-KRW",
            transactionType: "BUY",
            price: 1.0,
            transactionCnt: amount,
            transactionState: "COMPLETED",
            transactionDate: kstISOString
        };

        try {
            const res = await fetch(API.BASE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...headers
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(`자산 등록 실패: ${errMsg}`);
            }

            setToastMsg("보유자산이 등록되었습니다.");
            setShowForm(false);
            await refetchKrwBalance();
        } catch (e) {
            setErrorMsg(e.message);
        }
    };

    if (loadingBalance || loadingPrice || loadingInfo) {
        return <><AssetNavBar /><p style={{ textAlign: "center", marginTop: "2rem" }}>로딩 중...</p></>;
    }

    return (
        <>
            <AssetNavBar />
            <h1 className="asset-myasset-title">보유자산 홈</h1>

            <div className="asset-summary mt-5">
                <h3>보유자산</h3>
                <h2>{formatDecimalsWithCommas(summary.eval)}</h2>
                <p><strong>평가손익 :</strong> <span style={{ color: summary.profit >= 0 ? 'red' : 'blue' }}>{formatDecimalsWithCommas(summary.profit)} 원</span></p>
                <p><strong>수익률 :</strong> <span style={{ color: summary.rate >= 0 ? 'red' : 'blue' }}>{summary.rate.toFixed(2)} %</span></p>
                <button onClick={isAssetCleared ? () => setShowForm(true) : handleReset}>
                    {isAssetCleared ? "보유자산 추가하기" : "보유자산 초기화하기"}
                </button>
                {errorMsg && <p className="error-msg">{errorMsg}</p>}
            </div>

            <div>
                <hr />
                <PortfolioDonutChart data={chartData} />
                <hr />
            </div>

            {showForm && (
                <div className="asset-form-overlay">
                    <div className="asset-form">
                        <h2>모의투자 자산 추가하기</h2>
                        <p>모의투자 자산을 설정하세요!</p>
                        <p className="highlight-red">최소 100만원부터 최대 1억원까지</p>
                        <p>원하는 금액을 설정하여 자산을 추가할 수 있습니다.</p>
                        <p className="highlight-red">자산 초기화 시 보유 코인 및 자산은 전부<br/>
                        0원이 되며,</p>
                        <p>다시 자산을 추가해야 합니다.</p>
                        <label>
                            보유자산 금액 (원):
                            <input
                                type="number"
                                min={1000000}
                                max={100000000}
                                step={100000}
                                value={formData.amount}
                                onChange={e => setFormData({ amount: Number(e.target.value) })}
                            />
                        </label>
                        <div className="form-buttons">
                            <button type="submit" className="register-button" onClick={handleRegister}>등록하기</button>
                            <button className="cancel-button" onClick={() => setShowForm(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="asset-card-container">
                {combinedData.filter(item => item.market !== "KRW-KRW").map((item, idx) => (
                    <div
                        className="asset-card"
                        key={idx}
                        onClick={() => navigate(`/trade/order/${item.market}`)}
                        style={{ cursor: "pointer" }}
                    >
                        <p><strong>{item.koreanName}<br />{item.market.replace("-", "/")}</strong></p>
                        <p>평가손익 : <span className={item.profit >= 0 ? 'red' : 'blue'}>{formatDecimalsWithCommas(item.profit)} 원</span></p>
                        <p>수익률 : <span style={{ color: item.profitRate >= 0 ? 'red' : 'blue' }}>{item.profitRate.toFixed(2)}%</span></p>
                        <hr />
                        <p>보유 수량: {formatDecimalsWithCommas(item.holdingAmount)}</p>
                        <p>평균 매수가: {formatDecimalsWithCommas(item.averagePrice, true, 2)} 원</p>
                        <p>평가 금액: {formatDecimalsWithCommas(item.evalValue)} 원</p>
                        <p>매수 금액: {formatDecimalsWithCommas(item.buyValue)} 원</p>
                    </div>
                ))}
            </div>
            {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg("")} />}
        </>
    );
}

