import {Link} from "react-router-dom";
import "./HomePage.css"

export default function HomePage() {
    return (
        <>
            <ul className="homePage-ul">
                <li><Link to={"/trade"}>거래소</Link></li>
                <li><Link to={"/asset/my-asset"}>내자산</Link></li>
                <li><Link to={"/community/free"}>커뮤니티</Link></li>
                <li><Link to={"/news"}>뉴스</Link></li>
            </ul>
        </>
    )
}