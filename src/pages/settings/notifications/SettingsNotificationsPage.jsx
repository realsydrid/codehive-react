import React, { useState } from 'react';
import {Link} from "react-router-dom";

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

    const allOn = Object.values(settings).every(v => v);

    const toggle = (field) => {
        setSettings(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const toggleAll = () => {
        const newValue = !allOn;
        const updated = {};
        Object.keys(settings).forEach(key => {
            updated[key] = newValue;
        });
        setSettings(updated);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
            <h2 style={{ marginBottom: '24px', fontSize: '24px' }}>알림 설정</h2>

            <Section title="전체 알림">
                <Switch label="전체 알림" checked={allOn} onChange={toggleAll} />
            </Section>

            <Section title="거래소 알림">
                <Switch
                    label="급격한 시세변동 알림"
                    description="10% 이상 상승/하락시"
                    link="volatility"
                    checked={settings.volatilityYn}
                    onChange={() => toggle("volatilityYn")}
                />

                <Switch
                    label="보유 자산 알림"
                    checked={settings.portfolioYn}
                    description="매수 단가 기준 5% 구간 상승/하락시"
                    onChange={() => toggle("portfolioYn")}
                />
                <Switch
                    label="지정가 알림"
                    description="지정한 가격 도달 시 알림"
                    link="target-price"
                    checked={settings.targetPriceYn}
                    onChange={() => toggle("targetPriceYn")}
                />
                <Switch
                    label="매수/매도 체결시 알림"
                    checked={settings.tradeYn}
                    description="거래 체결시 알림"
                    onChange={() => toggle("tradeYn")}
                />
            </Section>

            <Section title="커뮤니티 알림">
                <Switch
                    label="내 게시물 좋아요"
                    checked={settings.likeYn}
                    description="10,50,100개 도달시"
                    onChange={() => toggle("likeYn")}
                />
                <Switch label="내 게시물에 댓글" checked={settings.commentYn} onChange={() => toggle("commentYn")} />
                <Switch label="나를 언급한 댓글" checked={settings.replyYn} onChange={() => toggle("replyYn")} />
                <Switch label="새로운 팔로워" checked={settings.followerYn} onChange={() => toggle("followerYn")} />
            </Section>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px 24px',
            marginBottom: '20px',
            backgroundColor: '#f9f9f9'
        }}>
            <h4 style={{ marginBottom: '16px', fontSize: '18px' }}>{title}</h4>
            {children}
        </div>
    );
}

function Switch({ label, description, checked, onChange, link }) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '10px 0',
        }}>
            {/* 텍스트 + 설명 */}
            <div style={{
                borderBottom: '1px solid #eee',
                paddingBottom: '8px',
                flexGrow: 1
            }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{label}</div>
                {description && (
                    <div style={{
                        fontSize: '13px',
                        color: '#888',
                        marginTop: '4px'
                    }}>
                        {description}
                    </div>
                )}
            </div>

            {/* 목록보기 + 스위치 (같은 라인) */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '420px',
                marginBottom: '8px',
                gap: '12px'
            }}>
                {link && (
                    <Link to={link} style={{
                        fontSize: '13px',
                        color: '#222',
                        textDecoration: 'none'
                    }}>
                        목록보기
                    </Link>
                )}

                <div
                    onClick={onChange}
                    style={{
                        width: '52px',
                        height: '28px',
                        backgroundColor: checked ? '#4caf50' : '#ccc',
                        borderRadius: '28px',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s'
                    }}
                >
                    <div style={{
                        width: '22px',
                        height: '22px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '3px',
                        left: checked ? '27px' : '3px',
                        transition: 'left 0.3s'
                    }} />
                </div>
            </div>
        </div>
    );
}