import {Link} from "react-router-dom";
import React from "react";

export default function NewsNavBar(){
    return (
        <nav id="newsNavBar">
            <div>
                <ul>
                    <li><Link to="/news" style={{color:"black"}}>뉴스 홈</Link></li>
                    <li><Link to="/news/fear-greed-index" style={{color:"black"}}>공포탐욕 인덱스</Link></li>
                    <li><Link to="/news/kimchi-premium" style={{color:"black"}}>김프가</Link></li>
                    <li><Link to="/news/futures" style={{color:"black"}}>선물</Link></li>
                </ul>
            </div>
        </nav>
    )
}