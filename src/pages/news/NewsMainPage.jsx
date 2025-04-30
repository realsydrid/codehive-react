import {useState} from "react";
import CryptoNews from "./CryptoNews.jsx";
import GlobalNews from "./GlobalNews.jsx";
import ExchangeRate from "./ExchangeRate.jsx";
import NewsNavBar from "./NewsNavBar.jsx";
import "./NewsMainPage.css";

export default function NewsMainPage() {
    const [activeTab, setActiveTab] = useState("main");

    return (
        <>
            <NewsNavBar />
            <br/>
            <h1 className="news-title">뉴스 홈</h1>
            <h2>전날 주요 뉴스</h2>
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