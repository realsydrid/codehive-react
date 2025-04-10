import {Link} from "react-router-dom";

export default function AssetHistoryPage() {
    return (
        <>
            <h1>거래내역</h1>
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