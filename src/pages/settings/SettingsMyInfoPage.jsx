import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyInfo, updateNickname, updateSelfIntroduction } from './UserService.js';
import './SettingsMyInfoPage.css'

export default function SettingsMyInfoPage() {
    const [user, setUser] = useState({});
    const [editNickname, setEditNickname] = useState(false);
    const [editIntro, setEditIntro] = useState(false);
    const [nickname, setNickname] = useState('');
    const [selfIntro, setSelfIntro] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // JWT 토큰 확인
        const jwt = localStorage.getItem("jwt");
        if (!jwt) {
            navigate('/login');
            return;
        }

        // 사용자 정보 불러오기
        setLoading(true);
        fetchMyInfo()
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('사용자 정보 로딩 오류:', err);
                setError('사용자 정보를 불러오는데 실패했습니다.');
                setLoading(false);
                
                if (err.message.includes('401')) {
                    // 인증 오류면 로그인 페이지로 이동
                    localStorage.removeItem('jwt');
                    navigate('/login');
                }
            });
    }, [navigate]);

    const saveNickname = () => {
        setLoading(true);
        updateNickname(nickname)
            .then(() => {
                setUser(prev => ({ ...prev, nickname }));
                setEditNickname(false);
                alert('닉네임이 변경되었습니다!');
                setLoading(false);
            })
            .catch(err => {
                console.error('닉네임 변경 오류:', err);
                alert('닉네임 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    const saveIntro = () => {
        setLoading(true);
        updateSelfIntroduction(selfIntro)
            .then(() => {
                setUser(prev => ({ ...prev, selfIntroduction: selfIntro }));
                setEditIntro(false);
                alert('자기소개가 변경되었습니다!');
                setLoading(false);
            })
            .catch(err => {
                console.error('자기소개 변경 오류:', err);
                alert('자기소개 변경에 실패했습니다.');
                setLoading(false);
            });
    };

    if (loading && !user.name) {
        return (
            <div className="SettingsMyInfoPage-container">
                <h1 className="SettingsMyInfoPage-title">내 정보</h1>
                <div className="SettingsMyInfoPage-loading">
                    <p>사용자 정보를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    if (error && !user.name) {
        return (
            <div className="SettingsMyInfoPage-container">
                <h1 className="SettingsMyInfoPage-title">내 정보</h1>
                <div className="SettingsMyInfoPage-error">
                    <p>{error}</p>
                </div>
                <button 
                    className="SettingsMyInfoPage-refreshButton"
                    onClick={() => window.location.reload()}
                >
                    새로고침
                </button>
            </div>
        );
    }

    return (
        <div className="SettingsMyInfoPage-container">

            <p className="SettingsMyInfoPage-row">
                <img
                    className="SettingsMyInfoPage-profileImg"
                    src={user?.profileImgUrl ? user.profileImgUrl : "/images/user_icon_default.png"}
                    alt="프로필 이미지"
                />
            </p>

            <p className="SettingsMyInfoPage-row">
                <span className="SettingsMyInfoPage-label">닉네임</span>
                {editNickname ? (
                    <>
                        <input 
                            type="text" 
                            className="SettingsMyInfoPage-input" 
                            value={nickname} 
                            onChange={(e) => setNickname(e.target.value)} 
                        />
                        <button 
                            className="SettingsMyInfoPage-button SettingsMyInfoPage-saveButton" 
                            onClick={saveNickname}
                            disabled={loading}
                        >저장</button>
                        <button 
                            className="SettingsMyInfoPage-button SettingsMyInfoPage-cancelButton" 
                            onClick={() => setEditNickname(false)}
                            disabled={loading}
                        >취소</button>
                    </>
                ) : (
                    <button 
                        className="SettingsMyInfoPage-editButton" 
                        onClick={() => { setNickname(user.nickname); setEditNickname(true); }}
                        disabled={loading}
                    >
                        {user.nickname}
                    </button>
                )}
            </p>

            <p className="SettingsMyInfoPage-row">
                <span className="SettingsMyInfoPage-label">이름</span> 
                <span className="SettingsMyInfoPage-value">{user.name}</span>
            </p>
            
            <p className="SettingsMyInfoPage-row">
                <span className="SettingsMyInfoPage-label">연락처</span> 
                <span className="SettingsMyInfoPage-value">{user.phone}</span>
            </p>
            
            <p className="SettingsMyInfoPage-row">
                <span className="SettingsMyInfoPage-label">이메일</span> 
                <span className="SettingsMyInfoPage-value">{user.email}</span>
            </p>
            
            <p className="SettingsMyInfoPage-row">
                <span className="SettingsMyInfoPage-label">생년월일</span> 
                <span className="SettingsMyInfoPage-value">{user.birthDate}</span>
            </p>

            <p className="SettingsMyInfoPage-row">
                <span className="SettingsMyInfoPage-label">자기소개</span>
                {editIntro ? (
                    <>
                        <input 
                            type="text" 
                            className="SettingsMyInfoPage-input SettingsMyInfoPage-introInput" 
                            value={selfIntro} 
                            onChange={(e) => setSelfIntro(e.target.value)} 
                        />
                        <button 
                            className="SettingsMyInfoPage-button SettingsMyInfoPage-saveButton" 
                            onClick={saveIntro}
                            disabled={loading}
                        >저장</button>
                        <button 
                            className="SettingsMyInfoPage-button SettingsMyInfoPage-cancelButton" 
                            onClick={() => setEditIntro(false)}
                            disabled={loading}
                        >취소</button>
                    </>
                ) : (
                    <button 
                        className="SettingsMyInfoPage-editButton" 
                        onClick={() => { setSelfIntro(user.selfIntroduction); setEditIntro(true); }}
                        disabled={loading}
                    >
                        {user.selfIntroduction || '자기소개를 작성해주세요'}
                    </button>
                )}
            </p>

            <p className="SettingsMyInfoPage-row SettingsMyInfoPage-withdrawalContainer">
                <Link 
                    to="/setting/my_info/withdrawal/withdrawal.do" 
                    className="SettingsMyInfoPage-link SettingsMyInfoPage-withdrawalLink"
                >
                    회원 탈퇴하기
                </Link>
            </p>
        </div>
    );
}
