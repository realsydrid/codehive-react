import {Link, useNavigate} from "react-router-dom";
import {UseLoginUserContext} from "../../provider/LoginUserProvider.jsx";
import {useContext, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import "./TopNavbar.css"

export default function TopNavbar() {
    const [loginUser, setLoginUser] = useContext(UseLoginUserContext);
    const navigate = useNavigate();
    const [sideProfileOpen, setSideProfileOpen] = useState(false);

    // useQuery를 사용하여 사용자 요약 정보 가져오기
    const {data: userSummary, isLoading, error} = useQuery({
        queryKey: ['userSummary'],
        queryFn: async () => {
            // 로그인 상태인 경우에만 API 호출
            if (!loginUser) return null;
            
            const response = await fetch('http://localhost:8801/api/users/me/summary', {
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
                                <div className="topNavbar-asset-amount">740,103 원</div>
                                <div>
                                    <span>평가손익</span>
                                    <span className="topNavbar-asset-profit">+148,908</span>
                                </div>
                                <div>
                                    <span>수익률</span>
                                    <span className="topNavbar-asset-profit">+20.12%</span>
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