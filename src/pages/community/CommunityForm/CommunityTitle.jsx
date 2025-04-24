export default function CommunityTitle({category}) {
    const categoryMsg={
        "free": "자유게시판",
        "chart": "차트분석 게시판",
        "pnl": "손익인증 게시판",
        "expert": "전문가 게시판"
    }
    return (<h1 style={{marginTop:"50px"}}>{categoryMsg[category]}</h1>)
}