import React from "react";
import {Link} from "react-router-dom";
import CryptoNews from "./CryptoNews.jsx";
import GlobalNews from "./GlobalNews.jsx";
import ExchangeRate from "./ExchangeRate.jsx";
import NewsNavBar from "./NewsNavBar.jsx";

export default function NewsMainPage() {
    const [activeTab, setActiveTab] = React.useState("NewsMainPage");
    return (
        <>
            <NewsNavBar/>
            <h1>뉴스 홈</h1>
            <table>
                <tbody>
                    <tr>
                        <td><button onClick={()=>
                            setActiveTab("main")}>전체 뉴스</button></td>
                        <td><button onClick={()=>
                            setActiveTab("crypto")}>암호화폐</button></td>
                        <td><button onClick={()=>
                            setActiveTab("global")}>해외증시</button></td>
                        <td><button onClick={()=>
                            setActiveTab("exchange")}>환율/금리</button></td>
                    </tr>
                </tbody>
            </table>

            <div>
                {activeTab === "crypto" && <CryptoNews />}
                {activeTab === "global" && <GlobalNews />}
                {activeTab === "exchange" && <ExchangeRate />}
            </div>
        </>
    );
}

