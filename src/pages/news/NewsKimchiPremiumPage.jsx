import {Link} from "react-router-dom";
import React from "react";

export default function NewsKimchiPremiumPage() {
    return (
        <>
            <h1>김프</h1>
            <nav>
                <ul>
                    <li><Link to="/news">뉴스 홈</Link></li>
                    <li><Link to="/news/fear-greed-index">공포탐욕 인덱스</Link></li>
                    <li><Link to="/news/kimchi-premium">김프가</Link></li>
                    <li><Link to="/news/futures">선물</Link></li>
                </ul>
            </nav>
        </>
    )
}