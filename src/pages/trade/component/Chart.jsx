import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import { useQuery } from '@tanstack/react-query';
import './Chart.css'

// 시간 프레임 옵션 정의
const TIME_FRAMES = {
    SEC1: { value: 'seconds', display: '1초', count: 200 },
    MIN1: { value: 'minutes/1', display: '1분', count: 200 },
    MIN3: { value: 'minutes/3', display: '3분', count: 200 },
    MIN5: { value: 'minutes/5', display: '5분', count: 200 },
    MIN10: { value: 'minutes/10', display: '10분', count: 200 },
    MIN15: { value: 'minutes/15', display: '15분', count: 200 },
    MIN30: { value: 'minutes/30', display: '30분', count: 200 },
    MIN60: { value: 'minutes/60', display: '1시간', count: 200 },
    MIN240: { value: 'minutes/240', display: '4시간', count: 200 },
    DAY: { value: 'days', display: '1일', count: 200 },
    WEEK: { value: 'weeks', display: '1주', count: 200 },
    MONTH: { value: 'months', display: '1개월', count: 200 },
};

export default function Chart({ market,combinedData }) {
    const [timeFrame, setTimeFrame] = useState('MIN1'); // 기본값: 1분
    const chartContainerRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const candleSeriesRef = useRef(null);
    const isInitializedRef = useRef(false);
    const [averagePrice, setAveragePrice] = useState(combinedData.trade_price);

    // 가격에 따라 적절한 소수점 자릿수 결정
    const getPricePrecision = (price) => {
        if (price < 0.0001) return { precision: 8, minMove: 0.00000001 };
        if (price < 0.001) return { precision: 7, minMove: 0.0000001 };
        if (price < 0.01) return { precision: 6, minMove: 0.000001 };
        if (price < 0.1) return { precision: 5, minMove: 0.00001 };
        if (price < 1) return { precision: 4, minMove: 0.0001 };
        if (price < 10) return { precision: 3, minMove: 0.001 };
        if (price < 100) return { precision: 2, minMove: 0.01 };
        if (price < 1000) return { precision: 1, minMove: 0.1 };
        return { precision: 0, minMove: 1 };
    };

    // 가격에 따른 포맷터 함수
    const getPriceFormatter = (price) => {
        return (p) => {
            if (price < 0.0001) return p.toFixed(8);
            if (price < 0.001) return p.toFixed(7);
            if (price < 0.01) return p.toFixed(6);
            if (price < 0.1) return p.toFixed(5);
            if (price < 1) return p.toFixed(4);
            if (price < 10) return p.toFixed(3);
            if (price < 100) return p.toFixed(2);
            if (price < 1000) return p.toFixed(1);
            return p.toFixed(0);
        };
    };

    // 선택된 시간 프레임에 따라 API URL 구성
    const getApiUrl = () => {
        const tf = TIME_FRAMES[timeFrame];
        return `https://api.upbit.com/v1/candles/${tf.value}?market=${market}&count=${tf.count}`;
    };

    // 적절한 refetchInterval 결정 (초/분 단위는 더 자주, 일/주/월 단위는 덜 자주)
    const getRefetchInterval = () => {
        if (timeFrame === 'SEC1') return 1000; // 1초
        if (timeFrame.startsWith('MIN')) {
            const minutes = parseInt(timeFrame.replace('MIN', ''));
            if (minutes <= 5) return 5000; // 5초
            if (minutes <= 30) return 15000; // 15초
            return 30000; // 30초
        }
        return 60000; // 1분 (일/주/월 단위)
    };

    // 캔들 데이터 가져오기
    const { data: candleData, isLoading } = useQuery({
        queryKey: ['candles', market, timeFrame],
        queryFn: async () => {
            const response = await fetch(getApiUrl());

            if (!response.ok) {
                throw new Error(`API 오류: ${response.status}`);
            }

            const data = await response.json();
            
            // 평균 가격 계산
            if (data && data.length > 0) {
                const sum = data.reduce((acc, candle) => acc + candle.trade_price, 0);
                const avg = sum / data.length;
                setAveragePrice(avg);
            }
            
            return data;
        },
        refetchInterval: getRefetchInterval(),
    });

    // 차트 생성
    useEffect(() => {
        if (!chartContainerRef.current) {
            console.log("돔로드아직안됨")
                        return;
        }
        console.log(averagePrice + "평균가");

        // 이전 차트 정리
        if (chartInstanceRef.current) {
            chartInstanceRef.current.remove();
            chartInstanceRef.current = null;

        }

        // 가격에 따른 포맷 설정
        const priceFormatter = getPriceFormatter(averagePrice)


        // 차트 생성
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: 'solid', color: '#ffffff' },
                textColor: '#333333',
            },
            grid: {
                vertLines: { color: '#f0f3fa' },
                horzLines: { color: '#f0f3fa' },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: timeFrame === 'SEC1',
            },
            // 가격 축(세로축) 설정
            rightPriceScale: {
                visible: true,
                borderColor: '#ddd',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2,
                },
                autoScale: true,
                mode: 0,
                formatter: priceFormatter,
            },
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
        });

        // 차트 인스턴스 저장
        chartInstanceRef.current = chart;

        // 가격에 따른 설정 가져오기
        const { precision, minMove } = getPricePrecision(averagePrice);

        // 캔들스틱 시리즈 생성
        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#c84a31',
            downColor: '#1261c4',
            borderVisible: false,
            wickUpColor: '#c84a31',
            wickDownColor: '#1261c4',
            priceFormat: {
                type: 'price',
                precision: precision,
                minMove: minMove,
            },
        });

        // 시리즈 레퍼런스 저장
        candleSeriesRef.current = candlestickSeries;

        // 화면 크기 변경 처리
        const handleResize = () => {
            if (chart && chartContainerRef.current) {
                chart.resize(
                    chartContainerRef.current.clientWidth,
                    chartContainerRef.current.clientHeight
                );
            }
        };

        window.addEventListener('resize', handleResize);
        isInitializedRef.current = false;

        // 정리 함수
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstanceRef.current) {
                chartInstanceRef.current.remove();
                chartInstanceRef.current = null;
            }
        };
    }, [market, timeFrame]); // 마켓, 시간 프레임, 평균 가격이 변경될 때 차트 다시 생성

    // 데이터가 변경될 때 차트 업데이트
    useEffect(() => {
        if (!candleData || !candleSeriesRef.current) return;

        // API 응답 데이터를 Lightweight Charts 형식으로 변환
        // API에서 오는 데이터는 최신 데이터가 맨 앞에 있으므로 reverse()로 순서 반전
        const formattedData = candleData.map(candle => ({
            time: new Date(candle.candle_date_time_kst + "Z").getTime() / 1000,
            open: candle.opening_price,
            high: candle.high_price,
            low: candle.low_price,
            close: candle.trade_price,
        })).reverse();

        // 초기 데이터 설정 (최초 로드 시에만)
        if (!isInitializedRef.current) {
            candleSeriesRef.current.setData(formattedData);

            // 차트 모든 콘텐츠 표시 (초기 로드 시에만)
            if (chartInstanceRef.current && formattedData.length > 0) {
                // fitContent() 대신 setVisibleRange() 또는 setVisibleLogicalRange() 사용
                const timeScale = chartInstanceRef.current.timeScale();
                
                // 최근 N개의 캔들만 보이도록 설정
                const visibleBars = 50; // 초기에 보이는 캔들 개수 (원하는 값으로 조정)
                const dataLength = formattedData.length;
                
                if (dataLength > 0) {
                    // 오른쪽 끝(최신 데이터)부터 visibleBars 개수만큼 보이도록 설정
                    timeScale.setVisibleLogicalRange({
                        from: dataLength - visibleBars, 
                        to: dataLength
                    });
                }
            }

            isInitializedRef.current = true;
        } else {
            // 이후 업데이트에서는 마지막 캔들만 업데이트
            if (formattedData.length > 0) {
                const lastCandle = formattedData[formattedData.length - 1];
                candleSeriesRef.current.update(lastCandle);
            }
        }
    }, [candleData]);

    return (
        <div  id={"contentsContainer"}>
            <div>
                <div className="timeframe-tabs">
                    {Object.entries(TIME_FRAMES).map(([key, { display }]) => (
                        <button
                            key={key}
                            onClick={() => setTimeFrame(key)}
                            className={timeFrame === key ? 'active' : ''}
                        >
                            {display}
                        </button>
                    ))}
                </div>
            </div>
            {isLoading && <div>로딩 중...</div>}
            <div
                ref={chartContainerRef}
                style={{ width: '100%', height: '100%' }}
                id="chartContainer"
            />
        </div>
    );
}