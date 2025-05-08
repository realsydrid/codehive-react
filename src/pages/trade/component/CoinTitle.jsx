import {formatDecimalsWithCommas, formatPercentWithDecimals} from "../../../utils/numberFormat.js";
import './CointTitle.css'
import {useState, useEffect} from "react";

export default function coinTitle({combinedData}) {

    // const ServerUrl="http://localhost:8801";
    const ServerUrl="";
    const [btnActive, setBtnActive] = useState(true);
    
    // 초기 로딩 시 즐겨찾기 상태 확인
    useEffect(() => {
        if (combinedData?.market) {
            checkFavoriteStatus();
        }
    }, [combinedData?.market]);
    
    // 해당 코인이 즐겨찾기에 있는지 확인
    const checkFavoriteStatus = async () => {
        try {
            const response = await fetch(`${ServerUrl}/api/favorites/me`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            if (response.ok) {
                const favoritesList = await response.json();
                // 현재 코인이 즐겨찾기 목록에 있는지 확인
                const isFavorite = favoritesList.includes(combinedData.market);
                setBtnActive(!isFavorite); // 즐겨찾기면 false, 아니면 true
            }
        } catch (error) {
            console.error("즐겨찾기 상태 확인 실패:", error);
        }
    };

    const favoriteBtnHandler = async () => {
        if (!combinedData || !combinedData.market) {
            console.error("코인 정보가 없습니다.");
            return;
        }
        
        try {
            const token = localStorage.getItem("jwt");
            if (!token) {
                alert("로그인이 필요한 서비스입니다.");
                return;
            }
            
            // btnActive가 true면 관심 추가(POST), false면 관심 제거(DELETE)
            const method = btnActive ? "POST" : "DELETE";
            
            const response = await fetch(`${ServerUrl}/api/favorites/me`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ market: combinedData.market })
            });
            
            if (response.ok) {
                // 성공적으로 요청 처리 후 상태 토글
                setBtnActive((prev) => !prev);
                console.log(btnActive ? "관심코인 추가 성공" : "관심코인 삭제 성공");
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error(`관심코인 ${btnActive ? '추가' : '삭제'} 실패:`, errorData.message || response.status);
            }
        } catch (error) {
            console.error("API 요청 실패:", error);
        }
    };

    return (
        <>
            {combinedData && combinedData.market &&
                <div className={"trade-coinTitle"}>

                    <div className={combinedData.change}>
                        <p>{formatDecimalsWithCommas(combinedData.trade_price)}</p>
                        <p>
                            <span>{formatPercentWithDecimals(combinedData.change_rate)}</span>
                            <span>{formatDecimalsWithCommas(combinedData.change_price)}</span>
                        </p>

                    </div>
                    <div>
                        <p>
                            <button
                                onClick={favoriteBtnHandler}
                                type={"button"}
                                className={btnActive ? "trade-coinTitle-FavoriteBtn" : "trade-coinTitle-FavoriteBtnActive"}>
                                {btnActive ? "관심추가" : "관심제거"}
                            </button>
                            {combinedData.korean_name}
                        </p>
                        <span>{combinedData.market.split("-")[1]}</span>
                    </div>

                </div>
            }
        </>
    )

}