import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import "./UsersProfilePage.css";
import { formatDecimalsWithCommas } from "../../utils/numberFormat.js";

// API 상수
const API = {
  BASE: "http://localhost:8801/api",
  TRANSACTION: "http://localhost:8801/api/transaction/me",
  COIN_PRICE: "https://api.upbit.com/v1/ticker/all?quote_currencies=KRW,BTC",
  COIN_NAME: "https://api.upbit.com/v1/market/all?is_details=false",
  USERS: "http://localhost:8801/api/users"
};

export default function UsersProfilePage() {
  const { userNo } = useParams();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [assetSummary, setAssetSummary] = useState({ eval: 0, profit: 0, rate: 0 });
  
  // 사용자 정보 조회
  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ["userProfile", userNo],
    queryFn: async () => {
      const response = await fetch(`${API.USERS}/${userNo}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      
      if (!response.ok) throw new Error("사용자 정보를 가져오는 데 실패했습니다.");
      return response.json();
    }
  });
  
  // 팔로우 상태 확인 - 내 팔로잉 목록을 가져와서 현재 사용자가 있는지 확인
  const { data: followingsList, refetch: refetchFollowings } = useQuery({
    queryKey: ["followings"],
    queryFn: async () => {
      const response = await fetch(`${API.USERS}/me/followings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      
      if (!response.ok) throw new Error("팔로잉 목록을 가져오는 데 실패했습니다.");
      return response.json();
    },
    staleTime: 0, // 항상 최신 데이터 사용
    refetchOnMount: true, // 컴포넌트 마운트될 때마다 새로 가져오기
    refetchOnWindowFocus: true, // 윈도우 포커스 시 새로 가져오기
  });
  
  // 팔로잉 목록 데이터가 변경될 때마다 팔로우 상태 업데이트
  useEffect(() => {
    if (followingsList && userNo) {
      // 팔로잉 목록에서 현재 프로필 사용자 ID 찾기
      console.log("팔로잉 목록:", followingsList);
      const isFollowingUser = followingsList.some(following => 
        Number(following.followingUserNo) === Number(userNo) || following.followingUserNo === userNo
      );
      console.log(`사용자 ${userNo} 팔로잉 여부:`, isFollowingUser);
      setIsFollowing(isFollowingUser);
    }
  }, [followingsList, userNo]);
  
  // 자산 정보 쿼리 - 보유 코인 내역 (현재 사용자의 것만 조회 가능)
  const { data: assetData } = useQuery({
    queryKey: ["userAsset", userNo],
    queryFn: async () => {
      // 프로필 주인이 본인인 경우에만 자산 정보 조회
      if (userNo === localStorage.getItem('userNo')) {
        const response = await fetch(API.TRANSACTION, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        
        if (!response.ok) throw new Error("자산 조회 실패");
        return response.json();
      }
      return null;
    },
    enabled: userNo === localStorage.getItem('userNo'),
  });
  
  // 코인 가격 정보 쿼리
  const { data: coinPrice } = useQuery({
    queryKey: ["userPageCoinPrice"],
    queryFn: async () => {
      const res = await fetch(API.COIN_PRICE);
      if (!res.ok) throw new Error("코인 가격 조회 실패");
      const data = await res.json();
      return data.map(({ market, trade_price }) => ({ market, trade_price }));
    },
    enabled: userNo === localStorage.getItem('userNo'),
    staleTime: 0,
    refetchInterval: 5000,
  });
  
  // 코인 이름 정보 쿼리
  const { data: coinInfo } = useQuery({
    queryKey: ["userPageCoinInfo"],
    queryFn: () => fetch(API.COIN_NAME).then(res => res.json()),
    enabled: userNo === localStorage.getItem('userNo'),
    staleTime: 1000 * 60 * 60, // 1시간 캐싱
  });
  
  // 자산 계산 로직
  useEffect(() => {
    if (!assetData || !coinPrice || !coinInfo || userNo !== localStorage.getItem('userNo')) return;
    
    const priceMap = new Map(coinPrice.map(({ market, trade_price }) => [market, trade_price]));
    
    let totalEval = 0, totalBuy = 0, totalProfit = 0;
    
    assetData.forEach(item => {
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
  }, [assetData, coinPrice, coinInfo, userNo]);
  
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  
  // 팔로우 처리
  const handleFollow = async () => {
    try {
      const response = await fetch(`${API.USERS}/follow/${userNo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          followingUserNo: userNo,
          followerUserNo: localStorage.getItem('userNo')
        })
      });
      
      if (response.ok) {
        // 팔로우 성공 시 팔로잉 상태로 변경 및 데이터 갱신
        setIsFollowing(true);
        await refetchFollowings(); // 완료될 때까지 대기
        console.log("팔로우 성공 - 상태 갱신됨");
      } else {
        alert('팔로우에 실패했습니다.');
      }
    } catch (error) {
      console.error('팔로우 요청 오류:', error);
      alert('팔로우 요청 중 오류가 발생했습니다.');
    }
  };
  
  // 언팔로우 처리
  const handleUnfollow = async () => {
    try {
      const response = await fetch(`${API.USERS}/unfollow/${userNo}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      
      if (response.ok) {
        setShowModal(false);
        setIsFollowing(false);
        await refetchFollowings(); // 완료될 때까지 대기
        console.log("언팔로우 성공 - 상태 갱신됨");
      } else {
        alert('언팔로우에 실패했습니다.');
      }
    } catch (error) {
      console.error('언팔로우 요청 오류:', error);
      alert('언팔로우 요청 중 오류가 발생했습니다.');
    }
  };
  
  if (isLoading) return <div className="container text-center my-5">로딩 중...</div>;
  if (error) return <div className="container text-center my-5 text-danger">오류: {error.message}</div>;
  
  return (
    <div className="userProfilePage-container">
      <h1>유저정보</h1>
      
      {userProfile && (
        <div className="userProfilePage-profile-content">
          {/* 프로필 헤더 */}
          <div className="userProfilePage-profile-header">
            <img 
              src={userProfile?.profileImgUrl ? userProfile.profileImgUrl : "/images/user_icon_default.png"}
              alt="프로필" 
              className="userProfilePage-profile-image"
            />
            <div className="userProfilePage-profile-info">
              <p className="userProfilePage-profile-nickname">{userProfile.nickname}</p>
              
              {userNo !== localStorage.getItem('userNo') && (
                <>
                  {!isFollowing ? (
                    <button 
                      onClick={handleFollow} 
                      className="userProfilePage-follow-button"
                    >
                      팔로우
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowModal(true)} 
                      className="userProfilePage-following-button"
                    >
                      팔로잉
                    </button>
                  )}
                </>
              )}
              
              <div className="userProfilePage-join-date">
                <p>가입일: {formatDate(userProfile.createdAt)}</p>
              </div>
            </div>
          </div>
          
          {/* 통계 정보 */}
          <div className="userProfilePage-stats-container">
            <div className="userProfilePage-stat-box">
              <Link to={`/users/${userNo}/boards`}>
                <p className="userProfilePage-stat-count">{userProfile.postCount || 0}</p>
                <span className="userProfilePage-stat-label">게시물</span>
              </Link>
            </div>
            <div className="userProfilePage-stat-box">
              <Link to={`/users/${userNo}/follow_list?tab=followers`}>
                <p className="userProfilePage-stat-count">{userProfile.followerCount || 0}</p>
                <span className="userProfilePage-stat-label">팔로워</span>
              </Link>
            </div>
            <div className="userProfilePage-stat-box">
              <Link to={`/users/${userNo}/follow_list?tab=followings`}>
                <p className="userProfilePage-stat-count">{userProfile.followingCount || 0}</p>
                <span className="userProfilePage-stat-label">팔로잉</span>
              </Link>
            </div>
          </div>
          
          {/* 자산 정보 - 본인의 프로필인 경우에만 표시 */}
          {userNo === localStorage.getItem('userNo') && (
            <div className="userProfilePage-asset-info-card">
              <p className="userProfilePage-section-title">보유자산</p>
              <p className="userProfilePage-asset-amount">{formatDecimalsWithCommas(assetSummary.eval)} 원</p>
              <p className="userProfilePage-asset-detail">
                <span>평가손익</span>
                <span className={assetSummary.profit >= 0 ? "userProfilePage-profit" : "userProfilePage-loss"}>
                  {assetSummary.profit >= 0 ? '+' : ''}{formatDecimalsWithCommas(assetSummary.profit)} 원
                </span>
              </p>
              <p className="userProfilePage-asset-detail">
                <span>수익률</span>
                <span className={assetSummary.rate >= 0 ? "userProfilePage-profit" : "userProfilePage-loss"}>
                  {assetSummary.rate >= 0 ? '+' : ''}{assetSummary.rate.toFixed(2)}%
                </span>
              </p>
            </div>
          )}
          
          {/* 자기소개 */}
          <div className="userProfilePage-intro-card">
            <p className="userProfilePage-section-title">자기소개</p>
            <p className="userProfilePage-intro-content">{userProfile.selfIntroduction || "자기소개가 없습니다."}</p>
          </div>
        </div>
      )}
      
      {/* 언팔로우 확인 모달 */}
      {showModal && (
        <>
          {/* 블랙스크린 오버레이 */}
          <div className="userProfilePage-modal-backdrop" onClick={() => setShowModal(false)}></div>
          
          {/* 모달 내용 */}
          <div className="userProfilePage-modal-container">
            <div className="userProfilePage-modal-content">
              <div className="userProfilePage-modal-user-info">
                <img 
                  src={userProfile?.profileImgUrl ? userProfile.profileImgUrl : "/images/user_icon_default.png"}
                  alt="프로필 이미지" 
                  className="userProfilePage-modal-profile-img"
                />
                <p>{userProfile?.nickname}</p>
              </div>
              <p className="userProfilePage-modal-confirm-text">팔로우를 취소하시겠습니까?</p>
              <hr />
              <button onClick={handleUnfollow} className="userProfilePage-unfollow-button">삭제</button>
              <button onClick={() => setShowModal(false)} className="userProfilePage-cancel-button">취소</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}