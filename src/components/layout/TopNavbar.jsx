import {Link, useNavigate} from "react-router-dom";
import {UseLoginUserContext} from "../../provider/LoginUserProvider.jsx";
import {useContext, useState, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import "./TopNavbar.css"
import {formatDecimalsWithCommas} from "../../utils/numberFormat.js";
// const ServerUrl="http://localhost:8801";
const ServerUrl="";
const API = {
    BASE: `${ServerUrl}/api/transaction`,
    BY_ME: `${ServerUrl}/api/transaction/me`,
    COIN_PRICE: `${ServerUrl}/ticker/all?quote_currencies=KRW,BTC`,
    COIN_NAME: `${ServerUrl}/market/all?is_details=false`
};

export default function TopNavbar() {
    const [loginUser, setLoginUser] = useContext(UseLoginUserContext);
    const navigate = useNavigate();
    const [sideProfileOpen, setSideProfileOpen] = useState(false);
    const [assetSummary, setAssetSummary] = useState({ eval: 0, profit: 0, rate: 0 });

    // useQuery를 사용하여 사용자 요약 정보 가져오기
    const {data: userSummary, isLoading, error} = useQuery({
        queryKey: ['userSummary'],
        queryFn: async () => {
            // 로그인 상태인 경우에만 API 호출
            if (!loginUser) return null;
            
            const response = await fetch(`${ServerUrl}/api/users/me/summary`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('사용자 정보를 가져오는데 실패했습니다.');
            }
            
            return response.json();
        },
        enabled: !!loginUser, // 로그인한 경우에만 쿼리 실행
        refetchOnWindowFocus: false,
    });
    
    // 자산 정보 쿼리 - 보유 코인 내역
    const { data: krwBalance } = useQuery({
        queryKey: ["topNavbarBalance"],
        queryFn: async () => {
            if (!loginUser) return null;
            
            const response = await fetch(API.BY_ME, { 
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            
            if (!response.ok) throw new Error("자산 조회 실패");
            return response.json();
        },
        enabled: !!loginUser && sideProfileOpen,
        refetchOnWindowFocus: false,
    });

    // 코인 가격 정보 쿼리
    const { data: coinPrice } = useQuery({
        queryKey: ["topNavbarCoinPrice"],
        queryFn: async () => {
            const res = await fetch(API.COIN_PRICE);
            if (!res.ok) throw new Error("코인 가격 실패");
            const data = await res.json();
            return data.map(({ market, trade_price }) => ({ market, trade_price }));
        },
        enabled: !!loginUser && sideProfileOpen,
        staleTime: 0,
        refetchInterval: sideProfileOpen ? 500 : false,
    });

    // 코인 이름 정보 쿼리
    const { data: coinInfo } = useQuery({
        queryKey: ["topNavbarCoinInfo"],
        queryFn: () => fetch(API.COIN_NAME).then(res => res.json()),
        enabled: !!loginUser && sideProfileOpen,
        staleTime: 1000 * 60 * 60, // 1시간 캐싱
    });

    // 자산 계산 로직
    useEffect(() => {
        if (!krwBalance || !coinPrice || !coinInfo || !sideProfileOpen) return;

        const priceMap = new Map(coinPrice.map(({ market, trade_price }) => [market, trade_price]));

        let totalEval = 0, totalBuy = 0, totalProfit = 0;

        krwBalance.forEach(item => {
            const { market, holdingAmount, averagePrice } = item;
            const isKRW = market === "KRW-KRW";
            const currentPrice = isKRW ? averagePrice : priceMap.get(market);
            const buyValue = averagePrice * holdingAmount;
            const evalValue = (currentPrice ?? 0) * holdingAmount;
            const profit = isKRW ? 0 : evalValue - buyValue;

            totalEval += evalValue;
            if (!isKRW) {
                totalBuy += buyValue;
                totalProfit += profit;
            }
        });

        setAssetSummary({
            eval: totalEval,
            profit: totalProfit,
            rate: totalBuy !== 0 ? (totalProfit / totalBuy) * 100 : 0
        });
    }, [krwBalance, coinPrice, coinInfo, sideProfileOpen]);

    const logoutHandler = () => {
        localStorage.removeItem("jwt");  // JWT 삭제
        setLoginUser(null);              // 로그인 사용자 초기화
        navigate("/");                   // 홈으로 이동
    };

    const loadSideProfile = () => {
        console.log("프로필클릭중")
        setSideProfileOpen(true);
    }
    
    const blackScreenClickHandler = () => {
        setSideProfileOpen(false);
    }
    
    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };
    
    return (
        <>
            <nav id="topNavbar">
                <div>
                    <a href="/">
                        <img src="/images/sample_logo.svg" alt="비트하이브로고"/>
                    </a>
                </div>
                <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                    <img
                        className="topNavbar-profileImg"
                        src={userSummary?.profileImgUrl ? userSummary.profileImgUrl : "/images/user_icon_default.png"}
                        alt="프로필로고"
                        onClick={loadSideProfile}
                    />
                    {loginUser ? (
                        <>
                            <span>{loginUser.nickname}님</span>
                            <button onClick={logoutHandler}
                                    style={{border: "none", background: "none", cursor: "pointer", color: "blue"}}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">로그인</Link>
                            <Link to="/signup">회원가입</Link>
                        </>
                    )}
                </div>
            </nav>
            {sideProfileOpen &&
                <>
                    <div className="topNavbar-blackScreen" onClick={blackScreenClickHandler}>
                    </div>
                </>
            }
            <div className={sideProfileOpen===true ? "topNavbar-sideProfile-container active" : "topNavbar-sideProfile-container" }>
                <div className="topNavbar-offcanvas-header">
                    <button type="button" className="topNavbar-btn-close" onClick={blackScreenClickHandler}>닫기</button>
                </div>
                
                <div className="topNavbar-offcanvas-body">
                    {isLoading ? (
                        <div style={{textAlign: 'center', padding: '20px'}}>로딩 중...</div>
                    ) : error ? (
                        <div style={{textAlign: 'center', padding: '20px', color: 'red'}}>
                            데이터를 불러오는데 실패했습니다.
                        </div>
                    ) : (
                        <>
                            {/* 프로필 헤더 섹션 */}
                            <div className="topNavbar-profile-header">
                                <div className="topNavbar-profile-image">
                                    <img src={userSummary?.profileImgUrl || "/images/user_icon_default.png"} alt="프로필 이미지"/>
                                </div>
                                <p style={{fontWeight: "bold", margin: "5px 0"}}>{userSummary?.nickname || loginUser?.nickname || "업쪽이"}</p>
                                <div className="topNavbar-join-date">가입일 : {formatDate(userSummary?.createdAt || loginUser?.createdAt)}</div>
                            </div>
                            
                            {/* 통계 그리드 */}
                            <div className="topNavbar-stats-grid">
                                <div className="topNavbar-stat-box">
                                    <p>{userSummary?.postCount || 0}</p>
                                    <span>게시물</span>
                                </div>
                                <div className="topNavbar-stat-box">
                                    <p>{userSummary?.followerCount || 0}</p>
                                    <span>팔로워</span>
                                </div>
                                <div className="topNavbar-stat-box">
                                    <p>{userSummary?.followingCount || 0}</p>
                                    <span>팔로잉</span>
                                </div>
                            </div>
                            
                            {/* 자산 정보 */}
                            <div className="topNavbar-asset-info">
                                <p style={{margin: "0", fontSize: "14px"}}>보유자산</p>
                                <div className="topNavbar-asset-amount">{formatDecimalsWithCommas(assetSummary.eval)} 원</div>
                                <div>
                                    <span>평가손익</span>
                                    <span className={assetSummary.profit >= 0 ? "topNavbar-asset-profit" : "topNavbar-asset-loss"}>
                                        {assetSummary.profit >= 0 ? '+' : ''}{formatDecimalsWithCommas(assetSummary.profit)}
                                    </span>
                                </div>
                                <div>
                                    <span>수익률</span>
                                    <span className={assetSummary.rate >= 0 ? "topNavbar-asset-profit" : "topNavbar-asset-loss"}>
                                        {assetSummary.rate >= 0 ? '+' : ''}{assetSummary.rate.toFixed(2)}%
                                    </span>
                                </div>
                                <Link to="/asset/my_asset" style={{display: "block", textAlign: "right", marginTop: "10px", fontSize: "14px"}}>
                                    내자산 자세히보기 &gt;
                                </Link>
                            </div>
                            
                            {/* 개인 정보 */}
                            <div className="topNavbar-personal-info">
                                <p>
                                    <span>이름:</span>
                                    <span>{userSummary?.name || "-"}</span>
                                </p>
                                <p>
                                    <span>생년월일:</span>
                                    <span>{formatDate(userSummary?.birthDate)}</span>
                                </p>
                                <p>
                                    <span>국가:</span>
                                    <span>{userSummary?.nationality || "대한민국"}</span>
                                </p>
                            </div>
                            
                            {/* 자기소개 */}
                            <div className="topNavbar-self-intro">
                                <p style={{fontWeight: "bold", marginBottom: "5px"}}>자기소개</p>
                                <p>{userSummary?.selfIntroduction || "자기소개가 없습니다."}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}