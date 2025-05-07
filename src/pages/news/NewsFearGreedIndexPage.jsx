import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import NewsNavBar from "./NewsNavBar.jsx";
import "./NewsFearGreedIndexPage.css";
import Loading from "../community/CommunityForm/Loading.jsx";

export default function NewsFearGreedIndexPage() {
    const [fngData, setFngData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFng = async () => {
            try {
                const res = await fetch("https://api.alternative.me/fng/?limit=7");
                if (!res.ok) throw new Error("공포탐욕지수를 불러오지 못했습니다");
                const json = await res.json();
                setFngData(json.data.reverse()); // 최근 데이터가 오른쪽에 오게
            } catch (err) {
                setError(err.message);
            }finally {
                setIsLoading(false);
            }
        };
        fetchFng();
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(parseInt(timestamp) * 1000);
        return `${date.getMonth() + 1}/${date.getDate()}`; // MM/DD 포맷
    };

    if (isLoading) return <Loading />;

    return (
        <>
            <NewsNavBar />
            <div className="fear-greed-container">
                <h1 className="news-title">공포탐욕지수</h1>

                {error && <p className="error-text">{error}</p>}

                {fngData.length === 0 ? (
                    <p className="loading-text">로딩 중...</p>
                ) : (
                    <>
                        <img
                            src="https://alternative.me/crypto/fear-and-greed-index.png"
                            alt="Latest Crypto Fear & Greed Index"
                            className="fear-greed-image mt-5"
                        />

                        <div className="fear-greed-chart">
                            <h2>공포탐욕지수 추이 7D</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={fngData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="timestamp" tickFormatter={formatDate} />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip
                                        formatter={(value) => `${value}점`}
                                        labelFormatter={(label) => `날짜: ${formatDate(label)}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8884d8"
                                        strokeWidth={3}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <p className="fear-greed-source">
                            출처: <a href="https://alternative.me/crypto/fear-and-greed-index/" target="_blank" rel="noopener noreferrer">alternative.me</a>
                        </p>
                    </>
                )}
            </div>

            <div className="fear-greed-info-box">
                <h2>공포탐욕지수 데이터 수집 과정</h2>
                <ul className="fng-list">
                    <li><strong>📉 변동성 (25%) :</strong> 최근 30/90일 평균 변동성과 비교</li>
                    <li><strong>📊 거래량 (25%) :</strong> 현재 거래량과 평균 비교</li>
                    <li><strong>💬 소셜미디어 (15%) :</strong> 트위터 데이터 분석</li>
                    <li><strong>📋 설문조사 (15%) :</strong> 투자자 여론조사</li>
                    <li><strong>🧲 지배력 (10%) :</strong> 비트코인 도미넌스</li>
                    <li><strong>📈 트렌드 (10%) :</strong> 구글 검색 트렌드</li>
                </ul>
            </div>

            <p className="update-info">※ 공포탐욕지수는 하루에 한 번 업데이트됩니다.</p>
        </>
    );
}