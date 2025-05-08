import React, { useEffect, useState } from 'react';
const serverURL="http://localhost:8801"
// const serverURL="";
export default function SettingsNotificationsVolatilityPage() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetch(`${serverURL}/api/volatility_alerts/me`)
            .then(res => res.json())
            .then(data => setAlerts(data.volatilityAlerts))
            .catch(err => console.error('알림 로드 실패:', err));
    }, []);

    const isEnabled = (market) => !market.endsWith(' (OFF)');
    const toggleMarketName = (market, enable) =>
        enable ? market.replace(' (OFF)', '') : market.replace(' (OFF)', '') + ' (OFF)';

    const handleToggle = (id, market) => {
        const enabled = isEnabled(market);
        const updatedMarket = toggleMarketName(market, !enabled);

        fetch(`${serverURL}/api/volatility_alerts/me`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, enabled: !enabled }),
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    setAlerts(alerts.map(alert =>
                        alert.id === id ? { ...alert, market: updatedMarket } : alert
                    ));
                } else {
                    console.error('저장 실패');
                }
            })
            .catch(err => console.error('상태 변경 실패:', err));
    };

    return (
        <div style={{ padding: '70px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>시세 변동 알림 목록</h1>
            <table className="table table-hover">
                <tbody>
                {alerts.map(alert => (
                    <tr key={alert.id}>
                        <td>{alert.market.replace(' (OFF)', '')}</td>
                        <td>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={isEnabled(alert.market)}
                                    onChange={() => handleToggle(alert.id, alert.market)}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
