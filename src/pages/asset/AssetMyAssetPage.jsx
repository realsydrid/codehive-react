import {Link, Route, Routes} from "react-router-dom";
import AssetHistoryPage from "./AssetHistoryPage.jsx";

export default function AssetMyAssetPage(){
    return (
        <>
            <h1>보유자산 홈</h1>
            <nav>
                <ul>
                    <li><Link to="/asset/my-asset">보유자산</Link></li>
                    <li><Link to="/asset/history">거래내역</Link></li>
                    <li><Link to="/asset/pending-orders">미체결</Link></li>
                </ul>
            </nav>
        </>
    )
}