import {Link} from "react-router-dom";

export default function BottomNavbar() {
    return (
        <>
            <nav id="bottomNavbar">
                <ul>
                    <li>전체메뉴</li>
                    <li><Link to={"/trade"}>거래소</Link></li>
                    <li><Link to={"/asset/my-asset"}>내자산</Link></li>
                    <li><Link to={"/community/free"}>커뮤니티</Link></li>
                    <li><Link to={"/news"}>뉴스</Link></li>
                </ul>
            </nav>
        </>
    )
}