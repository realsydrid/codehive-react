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
        <div style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '1rem',
            fontSize: '0.9rem'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
            }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>보유자산 포트폴리오</h3>
                <button onClick={() => setShowChart(false)} style={buttonStyle}>
                    접기
                </button>
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
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="45%"
                            innerRadius={50}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            nameKey="name"
                            labelLine={false} // 도넛 안에 선도 제거
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            wrapperStyle={{
                                fontSize: '0.75rem',
                                marginTop: '1rem',
                                lineHeight: '1.2rem',
                                textAlign: 'center'
                            }}
                            formatter={(value) => {
                                const item = chartData.find(d => d.name === value);
                                return `${value} (${item?.percent}%)`;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}