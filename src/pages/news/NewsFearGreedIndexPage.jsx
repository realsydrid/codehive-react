import { useEffect, useState } from "react";
import NewsNavBar from "./NewsNavBar.jsx";
import "./NewsFearGreedIndexPage.css"

export default function NewsFearGreedIndexPage() {
    const [fng, setFng] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFng = async () => {
            try {
                const res = await fetch("https://api.alternative.me/fng/");
                if (!res.ok) throw new Error("공포탐욕지수를 불러오지 못했습니다");
                const json = await res.json();
                setFng(json.data[0]);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchFng();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp) * 1000);
        return date.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    return (
        <>
            <NewsNavBar />
            <div className="fear-greed-container">
                <h1>공포탐욕지수</h1>
                <div style={{ marginTop: "2rem" }}>
                    {/*<h2>📊비트코인 공포탐욕 지수</h2>*/}
                    <img
                        src="https://alternative.me/crypto/fear-and-greed-index.png"
                        alt="Latest Crypto Fear & Greed Index"
                        style={{ width: "100%", maxWidth: "600px" }}
                    />
                </div>

                {error && <p style={{ color: "red" }}>{error}</p>}

                {!fng ? (
                    <p>로딩 중...</p>
                ) : (
                    <div className="fear-greed-card">
                        <p><strong>날짜:</strong> {formatDate(fng.timestamp)}</p>
                        <p><strong>지수 값:</strong> {fng.value}</p>
                        <p><strong>상태:</strong> {fng.value_classification}</p>
                        <p className="fear-greed-source">
                            출처: <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer">alternative.me</a>
                        </p>
                    </div>
                )}
            </div>
            <hr/>
            <div className="fear-greed-info-box">
                <h3>공포탐욕지수 데이터 수집 과정</h3>
                <ul className="fng-list">
                    <li><strong>📉 변동성 (25%) :</strong> 비트코인의 현재 변동성과 최대 하락폭을 지난 30일/90일 평균값과 비교합니다.</li>
                    <li><strong>📊 거래량 (25%) :</strong> 현재 거래량과 모멘텀을 지난 평균과 비교합니다.</li>
                    <li><strong>💬 소셜미디어 (15%) :</strong> 트위터 해시태그(주로 비트코인)에 대한 게시물 활동을 집계합니다.</li>
                    <li><strong>📋 설문조사 (15%) :</strong> 투자자 대상 여론조사를 통해 시장 심리를 파악합니다.</li>
                    <li><strong>🧲 지배력 (10%) :</strong> 전체 시장 대비 비트코인의 도미넌스 비율입니다.</li>
                    <li><strong>📈 트렌드 (10%) :</strong> 구글에서의 관련 검색어 트렌드를 분석합니다.</li>
                </ul>
            </div>
            <hr/>
            <p>공포탐욕 지수는 하루에 한번 업데이트 됩니다.</p>
        </>
    );
}