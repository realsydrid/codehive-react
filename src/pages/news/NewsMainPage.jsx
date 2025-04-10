import NewsFearGreedIndexPage from "./NewsFearGreedIndexPage.jsx";
import NewsKimchiPremiumPage from "./NewsKimchiPremiumPage.jsx";
import React from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import FuturesMainPage from "./FuturesMainPage.jsx";

export default function NewsMainPage() {
    return (
        <>
            <h1>뉴스 홈</h1>
            <nav>
                <ul>
                    <li><Link to="/news">뉴스 홈</Link></li>
                    <li><Link to="/news/fear-greed-index">공포탐욕 인덱스</Link></li>
                    <li><Link to="/news/kimchi-premium">김프가</Link></li>
                    <li><Link to="/news/futures">선물</Link></li>
                </ul>
            </nav>
        </>
    );
}

