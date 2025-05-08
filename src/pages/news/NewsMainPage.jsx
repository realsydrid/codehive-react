import {useEffect, useState} from "react";
import CryptoNews from "./CryptoNews.jsx";
import GlobalNews from "./GlobalNews.jsx";
import ExchangeRate from "./ExchangeRate.jsx";
import NewsNavBar from "./NewsNavBar.jsx";
import "./NewsMainPage.css";
import Swal from "sweetalert2";

// const SERVER_URL = "http://localhost:8801"
const SERVER_URL = "";

export default function NewsMainPage() {
    const [activeTab, setActiveTab] = useState("main");
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/api/news/yesterday`);
                const json = await res.json();
                setNews(json);
            } catch (err) {
                console.error("뉴스 로딩 실패:", err);
            }
        };

        fetchNews();
    }, []);

    const handleNewsClick = async (url) => {
        const result = await Swal.fire({
            title: "클릭 시 기사 본문으로 이동합니다.",
            text: "계속 진행하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#aaa",
            confirmButtonText: "이동",
            cancelButtonText: "취소"
        });

        if (result.isConfirmed) {
            window.open(url, "_blank");
        }
    };


    return (
        <>
            <NewsNavBar />
            <br/>
            <h1 className="news-title">뉴스 홈</h1>
            <h2 className="mt-5">전날 주요 뉴스</h2>
            <div className="news-carousel-container">
                {news.map((article, idx) => (
                    <div className="news-card" key={idx}>
                        <div
                            onClick={() => handleNewsClick(article.contentUrl)}
                            style={{ cursor: "pointer" }}
                        >
                            <img
                                src={article.thumbnailUrl || "https://placehold.co/250x150?text=No+Image"}
                                alt="썸네일"
                            />
                            <div className="news-card-title">{article.title}</div>
                        </div>
                    </div>
                ))}
            </div>
            <hr/>
            <div className="news-tab-container">
                <button
                    className={`news-tab-button ${activeTab === "main" ? "active" : ""}`}
                    onClick={() => setActiveTab("main")}
                >
                    전체 뉴스
                </button>
                <button
                    className={`news-tab-button ${activeTab === "crypto" ? "active" : ""}`}
                    onClick={() => setActiveTab("crypto")}
                >
                    암호화폐
                </button>
                <button
                    className={`news-tab-button ${activeTab === "global" ? "active" : ""}`}
                    onClick={() => setActiveTab("global")}
                >
                    해외증시
                </button>
                <button
                    className={`news-tab-button ${activeTab === "exchange" ? "active" : ""}`}
                    onClick={() => setActiveTab("exchange")}
                >
                    환율/금리
                </button>
            </div>

            <div className="news-content">
                {activeTab === "crypto" && <CryptoNews />}
                {activeTab === "global" && <GlobalNews />}
                {activeTab === "exchange" && <ExchangeRate />}
                {activeTab === "main" && (
                    <>
                        <CryptoNews />
                        <GlobalNews />
                        <ExchangeRate />
                    </>
                )}
            </div>
        </>
    );
}