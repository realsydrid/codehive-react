import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './SettingsNotificationsPage.css';

export default function SettingsNotificationsPage() {
    const [settings, setSettings] = useState({
        volatilityYn: false,
        portfolioYn: false,
        targetPriceYn: false,
        tradeYn: false,
        likeYn: false,
        commentYn: false,
        replyYn: false,
        followerYn: false
    });

    useEffect(() => {
        fetch('http://localhost:8801/api/notifications/me')
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error('불러오기 실패:', err));
    }, []);

    const toggle = (field) => {
        const updatedValue = !settings[field];
        setSettings(prev => ({ ...prev, [field]: updatedValue }));

        fetch('http://localhost:8801/api/notifications/me', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field, value: updatedValue })
        })
            .catch(err => console.error('저장 실패:', err));
    };

    const toggleAll = () => {
        const newValue = !Object.values(settings).every(v => v);
        const updatedSettings = {};
        Object.keys(settings).forEach(key => updatedSettings[key] = newValue);
        setSettings(updatedSettings);

        fetch('http://localhost:8801/api/notifications/me', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ field: "allNotifications", value: newValue })
        })
            .catch(err => console.error('전체 저장 실패:', err));
    };

    const allOn = Object.values(settings).every(v => v);

    return (
        <div className="notifications-container">
            <div className="notifications-title">알림 설정</div>

            <div className="notifications-section">
                <h4>전체 알림</h4>
                <Switch label="전체 알림 설정" checked={allOn} onChange={toggleAll} />
            </div>

            <div className="notifications-section">
                <h4>거래소 알림</h4>
                <Switch label="급격한 시세변동 알림" description="10% 이상 상승/하락시" link="volatility" checked={settings.volatilityYn} onChange={() => toggle("volatilityYn")} />
                <Switch label="보유 자산 알림" description="매수 단가 기준 5% 구간 상승/하락시" checked={settings.portfolioYn} onChange={() => toggle("portfolioYn")} />
                <Switch label="지정가 알림" description="설정한 지정가 도달시 알림" link="target-price" checked={settings.targetPriceYn} onChange={() => toggle("targetPriceYn")} />
                <Switch label="매수/매도 체결시 알림" description="거래 체결시 알림" checked={settings.tradeYn} onChange={() => toggle("tradeYn")} />
            </div>

            <div className="notifications-section">
                <h4>커뮤니티 알림</h4>
                <Switch label="내 게시글에 좋아요" description="10, 50, 100개 도달시" checked={settings.likeYn} onChange={() => toggle("likeYn")} />
                <Switch label="내 게시글에 댓글" checked={settings.commentYn} onChange={() => toggle("commentYn")} />
                <Switch label="나를 언급한 댓글" checked={settings.replyYn} onChange={() => toggle("replyYn")} />
                <Switch label="새로운 팔로워" checked={settings.followerYn} onChange={() => toggle("followerYn")} />
            </div>
        </div>
    );
}

function Switch({ label, description, checked, onChange, link }) {
    return (
        <div className="switch-item">
            <div className="switch-label">
                <div className="main-label">{label}</div>
                {description && <div className="sub-label">{description}</div>}
            </div>
            <div className="switch-actions">
                {link && <Link to={link} className="view-link">목록보기</Link>}
                <div className={`toggle-switch ${checked ? 'active' : ''}`} onClick={onChange}></div>
            </div>
        </div>
    );
}
