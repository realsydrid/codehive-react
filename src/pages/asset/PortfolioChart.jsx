import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF',
    '#FF6699', '#66CCFF', '#FF6666', '#99CC33'
];

export default function PortfolioDonutChart({ data }) {
    const [showChart, setShowChart] = useState(true);

    const filtered = data.filter(item => item.market !== 'KRW-KRW' && item.evalValue > 0);
    const krwItem = data.find(item => item.market === 'KRW-KRW');
    const totalValue = data.reduce((sum, item) => sum + item.evalValue, 0);

    const chartData = filtered.map(item => ({
        name: `${item.market.replace('KRW-', '')}`,
        value: item.evalValue,
        percent: ((item.evalValue / totalValue) * 100).toFixed(1)
    }));

    const buttonStyle = {
        padding: '5px 10px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.8rem',
        cursor: 'pointer'
    };

    if (!showChart) {
        return <button onClick={() => setShowChart(true)} style={buttonStyle}>포트폴리오 열기</button>;
    }

    return (
        <div className="portfolio-chart-container">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
            }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>보유자산 포트폴리오</h3>
                <button onClick={() => setShowChart(false)} style={buttonStyle}>접기</button>
            </div>

            {krwItem && (
                <p style={{
                    marginTop: '10px',
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    color: '#333'
                }}>
                    원화 보유액: {krwItem.evalValue.toLocaleString()} 원
                </p>
            )}

            {chartData.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>보유 자산이 없습니다.</p>
            ) : (
                <>
                    <div className="donut-chart-wrapper">
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart margin={{ top: 50, bottom: 20 }}>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="60%"
                                    innerRadius={50}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    dataKey="value"
                                    nameKey="name"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* 🔥 구분선 추가 */}
                    <hr style={{ marginTop: "2rem", marginBottom: "1rem" }} />

                    {/* ✅ Legend를 차트 아래에 수동 출력 */}
                    <div className="portfolio-legend-list">
                        {chartData.map((item, index) => (
                            <div key={item.name} className="portfolio-legend-item">
                                <span className="dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                <span className="label">{item.name}</span>
                                <span className="percent">({item.percent}%)</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}