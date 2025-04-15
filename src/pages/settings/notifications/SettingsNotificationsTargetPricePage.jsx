import React, { useEffect, useState } from 'react';

export default function SettingsNotificationsTargetPricePage() {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetch('/setting/support/notifications/volatility_alerts.do')
            .then(res => res.json())
            .then(data => setAlerts(data.volatilityAlerts))
            .catch(err => console.error('알림 로드 실패:', err));
    }, []);

    const handleToggle = (id, market) => {
        const enabled = !market.includes('OFF');
        fetch('/setting/support/notifications/volatility_alerts/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, enabled: !enabled }),
        })
            .then(() => {
                setAlerts(alerts.map(alert =>
                    alert.id === id ? { ...alert, market: enabled ? market + ' (OFF)' : market.replace(' (OFF)', '') } : alert
                ));
            })
            .catch(err => console.error('상태 변경 실패:', err));
    };

    return (
        <div style={{ padding: '70px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>지정가 변동 알림 목록</h1>
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
                                    checked={!alert.market.includes('OFF')}
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
