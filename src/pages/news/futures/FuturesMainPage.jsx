import {Link} from "react-router-dom";
import React from "react";
import NewsNavBar from "../NewsNavBar.jsx";

export default function FuturesMainPage() {
    return (
        <>
            <NewsNavBar/>
            <h1>선물</h1>
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