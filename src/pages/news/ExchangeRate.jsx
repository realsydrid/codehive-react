import { useEffect, useState } from "react";
import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";

export default function ExchangeRate() {
    const [newsList, setNewsList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch("http://localhost:8801/api/news/finance");
                const json = await res.json();
                setNewsList(json);
            } catch (error) {
                setError("뉴스를 불러오는 데 실패했습니다.");
            }
        };
        fetchNews();
    }, []);

    return (
        <>
            <NewsNavBar />
            <div className="news-container">
                <h1 className="news-title">💱 금리 / 환율 뉴스</h1>

                {error && <p className="error-text">{error}</p>}

                <ul className="news-list">
                    {newsList.map((item, index) => (
                        <li key={index} className="news-item">
                            <a href={item.contentUrl} target="_blank" rel="noopener noreferrer" className="news-link">
                                {item.thumbnailUrl && (
                                    <img src={item.thumbnailUrl} alt="뉴스 썸네일" className="news-thumbnail" />
                                )}
                                <div className="news-text">
                                    <h2>{item.title}</h2>
                                    <p>{item.summary}</p>
                                    <span className="news-date">{new Date(item.publishedAt).toLocaleString("ko-KR")}</span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}