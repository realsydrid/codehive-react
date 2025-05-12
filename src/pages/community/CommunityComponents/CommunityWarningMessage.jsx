export default function communityWarningMessage(category){
    const placeholderMsg={
        "free": "자유게시판 입니다. 자유롭게 소통하는 게시판이에요!",
        "chart": "차트분석 게시판입니다. 해당 차트를 분석하고 의견을 제시하는 게시판이에요!",
        "pnl": "손익인증 게시판입니다. 자신의 모의투자 손익을 인증하고 공유하는 게시판이에요!",
        "expert": "전문가 게시판입니다. 전문가의 입장에서 해당 화폐의 동향을 예측하는 게시판이에요! " +
            "인증을 받지 않으면 작성할 수 없습니다!"}
        return placeholderMsg[category]
    }
