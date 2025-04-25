import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyInfo, updateNickname, updateSelfIntroduction } from './UserService.js';

export default function SettingsMyInfoPage() {
    const [user, setUser] = useState({});
    const [editNickname, setEditNickname] = useState(false);
    const [editIntro, setEditIntro] = useState(false);
    const [nickname, setNickname] = useState('');
    const [selfIntro, setSelfIntro] = useState('');

    useEffect(() => {
        fetchMyInfo().then(setUser);
    }, []);

    const saveNickname = () => {
        updateNickname(nickname).then(() => {
            setUser(prev => ({ ...prev, nickname }));
            setEditNickname(false);
            alert('닉네임이 변경되었습니다!');
        });
    };

    const saveIntro = () => {
        updateSelfIntroduction(selfIntro).then(() => {
            setUser(prev => ({ ...prev, selfIntroduction: selfIntro }));
            setEditIntro(false);
            alert('자기소개가 변경되었습니다!');
        });
    };

    return (
        <div className="container">
            <h1>내 정보</h1>

            <p>
                <span>프로필 사진</span>
                <img
                    src={user.profileImgUrl || '/img/user_icon/user_icon_green.png'}
                    alt="프로필 이미지"
                    style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                />
            </p>

            <p>
                <span>닉네임</span>
                {editNickname ? (
                    <>
                        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                        <button onClick={saveNickname}>저장</button>
                        <button onClick={() => setEditNickname(false)}>취소</button>
                    </>
                ) : (
                    <button onClick={() => { setNickname(user.nickname); setEditNickname(true); }}>
                        {user.nickname}
                    </button>
                )}
            </p>

            <p><span>이름</span> {user.name}</p>
            <p><span>연락처</span> {user.phone}</p>
            <p><span>이메일</span> {user.email}</p>
            <p><span>생년월일</span> {user.birthDate}</p>

            <p>
                <span>자기소개</span>
                {editIntro ? (
                    <>
                        <input type="text" value={selfIntro} onChange={(e) => setSelfIntro(e.target.value)} />
                        <button onClick={saveIntro}>저장</button>
                        <button onClick={() => setEditIntro(false)}>취소</button>
                    </>
                ) : (
                    <button onClick={() => { setSelfIntro(user.selfIntroduction); setEditIntro(true); }}>
                        {user.selfIntroduction}
                    </button>
                )}
            </p>

            <p>
                <Link to="/setting/my_info/withdrawal/withdrawal.do" style={{ color: 'black', fontWeight: 'bold' }}>
                    회원 탈퇴하기
                </Link>
            </p>
        </div>
    );
}
