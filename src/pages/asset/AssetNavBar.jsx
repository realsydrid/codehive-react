import {Link} from "react-router-dom";

export default function AssetNavBar(){
    return (
        <nav id="assetNavBar">
            <div>
                <ul>
                    <li><Link to="/asset/my-asset">보유자산</Link></li>
                    <li><Link to="/asset/history">거래내역</Link></li>
                    <li><Link to="/asset/pending-orders">미체결</Link></li>
                </ul>
            </div>
        </nav>
    )
}