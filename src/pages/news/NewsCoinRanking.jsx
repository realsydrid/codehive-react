import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import NewsNavBar from "./NewsNavBar.jsx";
import "./NewsCoinRanking.css";

const EXCHANGE_API = import.meta.env.VITE_EXCHANGE_API_URL;

export default function NewsCoinRanking() {
    const [coins, setCoins] = useState([]);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await fetch(
                    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
                );
                if (!response.ok) {
                    throw new Error("코인 데이터를 불러오는데 실패했습니다.");
                }
                const data = await response.json();
                setCoins(data);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchExchangeRate = async () => {
            try {
                const response = await fetch(EXCHANGE_API);
                if (!response.ok) {
                    throw new Error("환율 데이터를 불러오는데 실패했습니다.");
                }
                const data = await response.json();
                setExchangeRate(data.conversion_rate);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCoins();
        fetchExchangeRate();
    }, []);

    return (
        <>
            <NewsNavBar />
            <div className="ranking-container">
                <h1 className="news-title">시가총액 순위</h1>
                {error && <p className="error">{error}</p>}
                <div className="table-wrapper">
                    <table className="ranking-table mt-3">
                        <thead>
                        <tr>
                            <th>순위</th>
                            <th>코인</th>
                            <th>24h 변동</th>
                            <th>시가총액 (KRW)</th>
                        </tr>
                        </thead>
                        <tbody>
                        {coins.map((coin, index) => (
                            <tr key={coin.id}>
                                <td>{index + 1}</td>
                                <td className="coin-name">
                                    <img src={coin.image} alt={coin.name} className="coin-image" />
                                    <div className="coin-text">
                                        <span className="coin-title">{coin.name}</span>
                                        <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                                    </div>
                                </td>
                                <td className={coin.price_change_percentage_24h >= 0 ? "positive" : "negative"}>
                                    {coin.price_change_percentage_24h?.toFixed(2)}%
                                </td>
                                <td>
                                    {exchangeRate
                                        ? `₩${Math.round(coin.market_cap * exchangeRate).toLocaleString()}`
                                        : "로딩중..."}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}