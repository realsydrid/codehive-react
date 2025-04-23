import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF', '#FF6699', '#66CCFF', '#FF6666', '#99CC33'
];

export default function PortfolioDonutChart({ data }) {
    const [showChart, setShowChart] = useState(true);

    const filtered = data.filter(item => item.market !== 'KRW-KRW' && item.evalValue > 0);
    const krwItem = data.find(item => item.market === 'KRW-KRW');

    const totalValue = data.reduce((sum, item) => sum + item.evalValue, 0);

    const chartData = filtered.map(item => ({
        name: `${item.koreanName} (${item.market.replace('KRW-', '')})`,
        value: item.evalValue,
        percent: ((item.evalValue / totalValue) * 100).toFixed(2)
    }));

    const openButtonStyle = {
        padding: '6px 12px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        cursor: 'pointer'
    }

    const closeButtonStyle = {
        padding: '6px 12px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '0.9rem',
        cursor: 'pointer'
    }

    if (!showChart) {
        return <button onClick={() => setShowChart(true)} style={openButtonStyle}>포트폴리오 열기</button>;
    }

    return (
        <div style={{ width: '100%', height: 450 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>보유자산 포트폴리오</h3>
                <button
                    onClick={() => setShowChart(false)}
                    style={closeButtonStyle}
                >
                    접기
                </button>
            </div>
            {krwItem && (
                <p style={{ marginTop: '10px' }}>
                    원화 보유액: {krwItem.evalValue.toLocaleString()} 원
                </p>
            )}
            {chartData.length === 0 ? (
                <p style={{ textAlign: 'center' }}>보유 자산이 없습니다.</p>
            ) : (
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={120}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} (${percent}%)`}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
