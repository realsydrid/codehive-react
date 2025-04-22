import AssetNavBar from "./AssetNavBar.jsx";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import "./AssetMyAssetPage.css";

const BASE_URL = "http://localhost:8801/api/transaction/krwBalance";

export default function AssetMyAssetPage() {
    const [combinedData, setCombinedData] = useState([]);
    const [totalEval, setTotalEval] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalProfitRate, setTotalProfitRate] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        amount: 1000000
    });

    const isAssetCleared = totalEval === 0 && combinedData.length === 0;

    const {
        data: krwBalance,
        isPending: isKrwBalanceLoading,
        refetch: refetchKrwBalance
    } = useQuery({
        queryKey: ["krwBalance"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        queryFn: async () => {
            const res = await fetch(BASE_URL);
            if (!res.ok) throw new Error("보유자산 정보를 불러오지 못했습니다.");
            return res.json();
        }
    });

    const {
        data: coinPrice,
        isPending: isCoinPriceLoading,
    } = useQuery({
        queryKey: ["coinPrice"],
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
        queryFn: async () => {
            const res = await fetch("https://api.upbit.com/v1/ticker/all?quote_currencies=KRW,BTC");
            if (!res.ok) throw new Error("현재가 불러오기 실패");
            const json = await res.json();
            return json.map(({ market, trade_price }) => ({ market, trade_price }));
        }
    });

    const {
        data: coinInfo,
        isPending: isCoinInfoLoading,
    } = useQuery({
        queryKey: ["coinInfo"],
        queryFn: async () => {
            const COIN_NAME = await fetch("https://api.upbit.com/v1/market/all?is_details=false");
            if (!COIN_NAME.ok) throw new Error("코인 정보 불러오기 실패");
            return COIN_NAME.json(); // { market, korean_name, english_name }
        }
    });

    // 데이터 계산
    useEffect(() => {
        if (!krwBalance || !coinPrice || !coinInfo) return;

        const priceMap = new Map();
        coinPrice.forEach(({ market, trade_price }) => {
            priceMap.set(market, trade_price);
        });

        const nameMap = new Map();
        coinInfo.forEach(({ market, korean_name }) => {
            nameMap.set(market, korean_name);
        });

        let totalEvalValue = 0;
        let totalBuyValue = 0;

        const evaluated = krwBalance.map(item => {
            const currentPrice = priceMap.get(item.market);
            const koreanName = nameMap.get(item.market);

            const holdingAmount = item.holdingAmount;
            const averagePrice = item.averagePrice;

            const buyValue = averagePrice * holdingAmount;
            const evalValue = currentPrice != null ? currentPrice * holdingAmount : 0;
            const profit = evalValue - buyValue;
            const profitRate = buyValue !== 0 ? (profit / buyValue) * 100 : 0;

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
                profitRate,
                koreanName
            };
        });

        setCombinedData(evaluated);
        setTotalEval(totalEvalValue);
        setTotalProfit(totalEvalValue - totalBuyValue);
        setTotalProfitRate(totalBuyValue !== 0 ? ((totalEvalValue - totalBuyValue) / totalBuyValue) * 100 : 0);
    }, [krwBalance, coinPrice, coinInfo]);

    // 초기화 요청 함수
    const deleteAll = async () => {
        const response = await fetch(`${BASE_URL}/1`, { method: 'DELETE' });
        if (!response.ok) throw new Error("보유자산 초기화에 실패했습니다.");
    };

    const myAssetReset = async () => {
        const confirm = window.confirm("자산을 초기화 하시겠습니까? (모든 거래 내역이 초기화되며 보유 자산은 0원이 됩니다)");

        if (!confirm) return;
        try {
            await deleteAll();
            setCombinedData([]);
            setTotalEval(0);
            setTotalProfit(0);
            setTotalProfitRate(0);
            setIsCleared(true);
        } catch (e) {
            setErrorMsg(e.message);
        }
    };

    const myAssetReload = async () => {
        await refetchKrwBalance();
        setIsCleared(false);
    }

    // 로딩 중 UI
    if (isKrwBalanceLoading || isCoinPriceLoading || isCoinInfoLoading) {
        return (
            <>
                <AssetNavBar />
                <p style={{ textAlign: "center", marginTop: "2rem" }}>로딩 중...</p>
            </>
        );
    }


    return (
        <>
            <AssetNavBar />
            <h1>보유자산 홈</h1>

            <div className="asset-summary">
                <h3>보유자산</h3>
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
                <button onClick={() => {
                    if (isAssetCleared) {
                        setShowForm(true); // 폼 열기
                    } else {
                        myAssetReset(); // 초기화
                    }
                }}>
                    {isAssetCleared ? "보유자산 추가하기" : "보유자산 초기화하기"}
                </button>
                {errorMsg && <p className="error-msg">{errorMsg}</p>}
            </div>
            {showForm && (
                <div className="asset-form-overlay">
                    <div className="asset-form">
                        <h2>모의투자 자산 추가하기</h2>
                        <p>모의투자 자산을 설정하세요!</p>
                        <p className="highlight-red">최소 100만원부터 최대 1억원까지</p>
                        <p>원하는 금액을 설정하여 자산을 추가할 수 있습니다.</p>

                        <p><strong>자산 초기화 시 보유 코인 및 자산은 전부 <br/>
                            0원으로 초기화 됩니다.</strong></p>

                        <label>
                            보유자산 금액 (원):
                            <input
                                type="number"
                                min={1000000}
                                max={100000000}
                                step={100000}
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                            />
                        </label>

                        <div className="form-buttons">
                            <button onClick={() => {
                                console.log("보유자산 등록 데이터:", formData);
                                alert("보유자산이 등록되었습니다.");
                                setShowForm(false);
                                refetchKrwBalance();
                            }}>등록하기</button>
                            <button onClick={() => {

                                setShowForm(false)
                            }}>취소</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="asset-card-container">
                {combinedData
                    .filter(item => item.market !== "KRW-KRW")
                    .map((item, idx) => (
                        <div className="asset-card" key={idx}>
                            <p>
                                <strong>
                                    {item.koreanName}<br />
                                    {item.market.replace("-", "/")}
                                </strong>
                            </p>
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
                            <hr />
                            <p>보유 수량: {item.holdingAmount.toLocaleString()}</p>
                            <p>평균 매수가: {item.averagePrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} 원</p>
                            <p>평가 금액: {item.evalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원</p>
                            <p>매수 금액: {item.buyValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} 원</p>
                        </div>
                    ))}
            </div>
        </>
    );
}