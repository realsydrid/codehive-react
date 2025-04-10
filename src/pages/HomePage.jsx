import {Link} from "react-router-dom";

export default function HomePage() {
    return (
        <>
            <h1>홈화면</h1>
            <ul>
                <li><Link to={"/trade"}>거래소</Link></li>
                <li><Link to={"/asset/my-asset"}>내자산</Link></li>
                <li><Link to={"/community/free"}>커뮤니티</Link></li>
                <li><Link to={"/news"}>뉴스</Link></li>
            </ul>

            <Link to={"/settings"}>설정</Link>
        </>
    )
}