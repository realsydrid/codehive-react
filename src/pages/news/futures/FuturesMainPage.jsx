import {Link} from "react-router-dom";
import React from "react";

export default function FuturesMainPage() {
    return (
        <>
            <h1>선물</h1>
            <nav>
                <ul>
                    <li><Link to="/news">뉴스 홈</Link></li>
                    <li><Link to="/news/fear-greed-index">공포탐욕 인덱스</Link></li>
                    <li><Link to="/news/kimchi-premium">김프가</Link></li>
                    <li><Link to="/news/futures">선물</Link></li>
                </ul>
            </nav>
            <table>
                <tbody>
                    <tr>
                        <td><Link to="/news/futures/liquidations">강제청산비율</Link></td>
                        <td><Link to="/news/futures/long-short">롱&숏 비율</Link></td>
                        <td><Link to="/news/futures/open-interest">미결제약정</Link></td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}