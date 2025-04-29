import {Link} from "react-router-dom";
import React from "react";

export default function NewsNavBar(){
    return (
        <nav id="newsNavBar">
            <div>
                <ul>
                    <li><Link to="/news" style={{color:"white"}}>뉴스 홈</Link></li>
                    <li><Link to="/news/fear-greed-index" style={{color:"white"}}>공포탐욕 인덱스</Link></li>
                    <li><Link to="/news/kimchi-premium" style={{color:"white"}}>가격 프리미엄</Link></li>
                    <li><Link to="/news/market-cap-ranking" style={{color:"white"}}>시가총액</Link></li>
                </ul>
            </div>
        </nav>
    )
}