import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import './UsersProfileFollowings.css';
// const ServerUrl="http://localhost:8801";
const ServerUrl="";
const API = {
  USERS: `${ServerUrl}/api/users`
};

export default function UsersProfileFollowingsPage() {
  const { userNo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("followers");
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserNo, setCurrentUserNo] = useState(null);
  const [userName, setUserName] = useState("");
  const observerRef = useRef();
  const size = 10;
  const [myFollowings, setMyFollowings] = useState([]);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);
  const [userToUnfollow, setUserToUnfollow] = useState(null);

  // URL 쿼리 파라미터에서 active 탭 설정
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = localStorage.getItem('jwt');
        if (!token) return;
        
        const response = await fetch(`${ServerUrl}/api/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentUserNo(data.id); // 현재 로그인한 사용자의 ID 저장
          
          // 현재 사용자의 팔로잉 목록 가져오기
          fetchMyFollowings(data.id);
        }
      } catch (error) {
        console.error("현재 사용자 정보를 가져오는데 실패했습니다:", error);
      }
    };
    
    // 사용자 기본 정보 가져오기
    const getUserInfo = async () => {
      try {
        const response = await fetch(`${API.USERS}/${userNo}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserName(data.nickname);
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      }
    };
    
    getCurrentUser();
    getUserInfo();
  }, [userNo]);
  
  // 내 팔로잉 목록 가져오기
  const fetchMyFollowings = async (userId) => {
    try {
      const response = await fetch(`${API.USERS}/me/followings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMyFollowings(data);
      }
    } catch (error) {
      console.error("팔로잉 목록을 가져오는데 실패했습니다:", error);
    }
  };
  
  // 사용자가 팔로우 중인지 확인하는 함수
  const isFollowing = (userNo) => {
    return myFollowings.some(following => 
      Number(following.followingUserNo) === Number(userNo) ||
      following.followingUserNo === userNo
    );
  };

  // 무한 스크롤을 위한 Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading, activeTab]);

  // 팔로워 또는 팔로잉 데이터 로딩
  const fetchData = async (tab, pageNum) => {
    setLoading(true);
    try {
      const endpoint = tab === "followers" ? "followers" : "followings";
      const response = await fetch(`${API.USERS}/${userNo}/${endpoint}?page=${pageNum}&size=${size}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) {
        throw new Error("데이터를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      
      // 더 이상 데이터가 없는 경우
      if (data.length === 0) {
        setHasMore(false);
        setLoading(false);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      setHasMore(false);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 처리
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(0);
    setHasMore(true);
    
    // URL 쿼리 파라미터 변경
    navigate(`/users/profile/${userNo}/followings?tab=${tab}`);
    
    if (tab === "followers") {
      setFollowers([]);
      loadFollowers(0, true);
    } else {
      setFollowings([]);
      loadFollowings(0, true);
    }
  };

  // 팔로워 데이터 로드
  const loadFollowers = async (pageNum, reset = false) => {
    const newData = await fetchData("followers", pageNum);
    setFollowers((prev) => reset ? newData : [...prev, ...newData]);
    setPage(pageNum + 1);
  };

  // 팔로잉 데이터 로드
  const loadFollowings = async (pageNum, reset = false) => {
    const newData = await fetchData("followings", pageNum);
    setFollowings((prev) => reset ? newData : [...prev, ...newData]);
    setPage(pageNum + 1);
  };

  // 추가 데이터 로드
  const loadMore = async () => {
    if (loading) return;
    
    if (activeTab === "followers") {
      await loadFollowers(page);
    } else {
      await loadFollowings(page);
    }
  };

  // 팔로우 기능
  const handleFollow = async (targetUserNo) => {
    try {
      const response = await fetch(`${API.USERS}/follow/${targetUserNo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          followingUserNo: targetUserNo,
          followerUserNo: currentUserNo
        })
      });
      
      if (response.ok) {
        // 팔로우 성공 시 데이터 새로고침
        fetchMyFollowings(currentUserNo);
        if (activeTab === "followers") {
          loadFollowers(0, true);
        } else {
          loadFollowings(0, true);
        }
      } else {
        alert('팔로우에 실패했습니다.');
      }
    } catch (error) {
      console.error('팔로우 요청 오류:', error);
    }
  };

  // 언팔로우 모달 표시
  const showUnfollowConfirm = (targetUserNo) => {
    setUserToUnfollow(targetUserNo);
    setShowUnfollowModal(true);
  };
  
  // 언팔로우 기능
  const handleUnfollow = async () => {
    if (!userToUnfollow) return;
    
    try {
      const response = await fetch(`${API.USERS}/unfollow/${userToUnfollow}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      
      if (response.ok) {
        // 언팔로우 성공 시 데이터 새로고침
        setShowUnfollowModal(false);
        fetchMyFollowings(currentUserNo);
        if (activeTab === "followers") {
          loadFollowers(0, true);
        } else {
          loadFollowings(0, true);
        }
      } else {
        alert('언팔로우에 실패했습니다.');
      }
    } catch (error) {
      console.error('언팔로우 요청 오류:', error);
    }
  };

  // 검색어 필터링
  const filteredFollowers = followers.filter(
    (follower) => 
      follower.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (follower.name && follower.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFollowings = followings.filter(
    (following) => 
      following.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (following.name && following.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 초기 데이터 로드
  useEffect(() => {
    if (activeTab === "followers") {
      loadFollowers(0, true);
    } else {
      loadFollowings(0, true);
    }
  }, [activeTab]);

    return (
    <div className="userProfileFollowings-container">
      <div className="userProfileFollowings-header">
        <h2>{userName}님의 팔로우 목록</h2>
        <div className="userProfileFollowings-tabs">
          <button 
            className={`userProfileFollowings-tab-button ${activeTab === "followers" ? "active" : ""}`}
            onClick={() => handleTabChange("followers")}
          >
            팔로워
          </button>
          <button 
            className={`userProfileFollowings-tab-button ${activeTab === "followings" ? "active" : ""}`}
            onClick={() => handleTabChange("followings")}
          >
            팔로잉
          </button>
        </div>
      </div>
      
      <div className="userProfileFollowings-search">
        <input 
          type="text" 
          placeholder="검색어를 입력하세요" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="userProfileFollowings-search-input"
        />
      </div>
      
      <div className="userProfileFollowings-list">
        {activeTab === "followers" ? (
          filteredFollowers.length > 0 ? (
            filteredFollowers.map((follower) => (
              <div key={follower.followerUserNo} className="userProfileFollowings-item">
                <div className="userProfileFollowings-user-info">
                  <Link to={`/users/profile/${follower.followerUserNo}`}>
                    <img 
                      src={follower.profileImgUrl || "/images/user_icon_default.png"} 
                      alt="프로필 이미지" 
                      className="userProfileFollowings-profile-img" 
                    />
                  </Link>
                  <div>
                    <Link to={`/users/profile/${follower.followerUserNo}`}>
                      <p className="userProfileFollowings-nickname">{follower.nickname}</p>
                    </Link>
                    {follower.name && <p className="userProfileFollowings-name">{follower.name}</p>}
                  </div>
                </div>
                {currentUserNo && currentUserNo !== follower.followerUserNo && (
                  isFollowing(follower.followerUserNo) ? (
                    <button 
                      className="userProfileFollowings-unfollow-button"
                      onClick={() => showUnfollowConfirm(follower.followerUserNo)}
                    >
                      팔로잉
                    </button>
                  ) : (
                    <button 
                      className="userProfileFollowings-follow-button"
                      onClick={() => handleFollow(follower.followerUserNo)}
                    >
                      팔로우
                    </button>
                  )
                )}
              </div>
            ))
          ) : (
            <p className="userProfileFollowings-empty-message">팔로워가 없습니다.</p>
          )
        ) : (
          filteredFollowings.length > 0 ? (
            filteredFollowings.map((following) => (
              <div key={following.followingUserNo} className="userProfileFollowings-item">
                <div className="userProfileFollowings-user-info">
                  <Link to={`/users/profile/${following.followingUserNo}`}>
                    <img 
                      src={following.profileImgUrl || "/images/user_icon_default.png"} 
                      alt="프로필 이미지" 
                      className="userProfileFollowings-profile-img" 
                    />
                  </Link>
                  <div>
                    <Link to={`/users/profile/${following.followingUserNo}`}>
                      <p className="userProfileFollowings-nickname">{following.nickname}</p>
                    </Link>
                    {following.name && <p className="userProfileFollowings-name">{following.name}</p>}
                  </div>
                </div>
                {currentUserNo && currentUserNo !== following.followingUserNo && (
                  isFollowing(following.followingUserNo) ? (
                    <button 
                      className="userProfileFollowings-unfollow-button"
                      onClick={() => showUnfollowConfirm(following.followingUserNo)}
                    >
                      팔로잉
                    </button>
                  ) : (
                    <button 
                      className="userProfileFollowings-follow-button"
                      onClick={() => handleFollow(following.followingUserNo)}
                    >
                      팔로우
                    </button>
                  )
                )}
              </div>
            ))
          ) : (
            <p className="userProfileFollowings-empty-message">팔로잉하는 사용자가 없습니다.</p>
          )
        )}
        {hasMore && (
          <div ref={observerRef} className="userProfileFollowings-loading">
            {loading && <p>로딩 중...</p>}
          </div>
        )}
      </div>
      
      {/* 언팔로우 확인 모달 */}
      {showUnfollowModal && (
        <>
          <div className="userProfileFollowings-modal-backdrop" onClick={() => setShowUnfollowModal(false)}></div>
          <div className="userProfileFollowings-modal-container">
            <div className="userProfileFollowings-modal-content">
              <p className="userProfileFollowings-modal-confirm-text">팔로우를 취소하시겠습니까?</p>
              <div className="userProfileFollowings-modal-buttons">
                <button onClick={handleUnfollow} className="userProfileFollowings-unfollow-button">삭제</button>
                <button onClick={() => setShowUnfollowModal(false)} className="userProfileFollowings-cancel-button">취소</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}