import {Link} from "react-router-dom";

export default function CommunityTitle({category}) {
    const categoryMsg={
        "free": "자유게시판",
        "chart": "차트분석 게시판",
        "pnl": "손익인증 게시판",
        "expert": "전문가 게시판"
    }
    return (
        <div style={{marginTop:"50px"}}>
        <Link to="/community/search" >검색</Link>
        <h1>{categoryMsg[category]}</h1>
        </div>
    )
}