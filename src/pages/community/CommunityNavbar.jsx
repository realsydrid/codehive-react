import {Link} from "react-router-dom";

export default function CommunityNavbar() {

    return (
        <nav id="communityNavbar" >
            <div>
            <ul>
                <li>
                    <Link to="/community/free" style={{color:'white', textDecoration:"none"}}>자유</Link>
                </li>
                <li>
                    <Link to="/community/pnl" style={{color:'white', textDecoration:"none"}}>손익인증</Link>
                </li>
                <li>
                    <Link to="/community/chart" style={{color:'white', textDecoration:"none"}}>차트분석</Link>
                </li>
                <li>
                    <Link to="/community/expert" style={{color:'white', textDecoration:"none"}}>전문가</Link>
                </li>
            </ul>
            </div>
        </nav>
    )
}