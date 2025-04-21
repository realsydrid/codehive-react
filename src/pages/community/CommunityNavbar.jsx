import {Link} from "react-router-dom";

export default function CommunityNavbar() {

    return (
        <nav id="communityNavbar">
            <div>
            <ul>
                <li>
                    <Link to="/community/free" style={{color:"black"}}>자유</Link>
                </li>
                <li>
                    <Link to="/community/pnl" style={{color:"black"}}>손익인증</Link>
                </li>
                <li>
                    <Link to="/community/chart" style={{color:"black"}}>차트분석</Link>
                </li>
                <li>
                    <Link to="/community/expert" style={{color:"black"}}>전문가</Link>
                </li>
            </ul>
            </div>
        </nav>
    )
}