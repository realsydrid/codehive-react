import {Link} from "react-router-dom";

export default function AssetPendingOrdersPage() {
    return (
        <>
            <h1>미체결</h1>
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