import {useEffect, useRef, useState} from "react";
import {formatDecimalsWithCommas} from "../../../utils/numberFormat.js";
import "./OrderBook.css"

export default function OrderBook({market, orderBook, combinedData}) {
    const orderUnits = orderBook?.[0]?.orderbook_units;
    const maxSize = Math.max(...orderUnits.map(unit => Math.max(unit.ask_size, unit.bid_size)));
        // 호가창 컨테이너 참조 생성
    const orderBookRef = useRef(null);
    // 사용자가 수동으로 스크롤 했는지 추적
    const userScrolledRef = useRef(false);

    // 초기 스크롤 위치 설정 및 유지 로직
    useEffect(() => {
        if (!orderBookRef.current || !orderUnits) return;

        // 데이터가 로드된 후 초기 스크롤 위치를 중간으로 설정
        const scrollToMiddle = () => {
            if (!userScrolledRef.current) {
                const container = orderBookRef.current;
                const middlePosition = container.scrollHeight / 2 - container.clientHeight / 2;
                container.scrollTop = middlePosition;
            }
        };

        scrollToMiddle();

        // 스크롤 이벤트 리스너 추가
        const handleScroll = () => {
            userScrolledRef.current = true;
        };

        const container = orderBookRef.current;
        container.addEventListener('scroll', handleScroll);

        // 일정 시간 후에 사용자 스크롤 플래그 초기화 (옵션)
        const resetTimer = setTimeout(() => {
            userScrolledRef.current = false;
        }, 60000); // 1분 후 초기화

        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(resetTimer);
        };
    }, [orderUnits]); // orderUnits가 변경될 때마다 실행


    return (
        <>
            <div className="orderBook-contentsContainer">
                {/* 좌측 상단 - 매도호가 */}
                <div className="orderBook-askContainer">
                    {orderUnits?.slice().reverse().map((unit, index) => (
                        <div key={index} className="orderBook-askPriceDiv">
                            <div>
                                <span>{formatDecimalsWithCommas(unit.ask_price, true)}</span>
                            </div>
                            <div className="orderBook-sizeDiv">
                                <div style={{width: `${(unit.ask_size / maxSize) * 100}%`}}>-</div>
                                <span>{formatDecimalsWithCommas(unit.ask_size, true, 3)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 우측 상단 - 현재가 정보 */}
                <div className={`orderBook-centerContainer ${combinedData?.change}`}>
                    <p className="orderBook-currentPrice">
                        {formatDecimalsWithCommas(combinedData?.trade_price)}원
                    </p>
                    <p className={`orderBook-changeRate`}>
                        <span className="orderBook-change-icon"></span>
                        <span>
                            {combinedData?.change === 'RISE' ? '+' : ''}
                            {(combinedData?.signed_change_rate * 100).toFixed(2)}%
                        </span>
                    </p>
                    <div className="orderBook-priceInfo">
                        <p>
                            <span>고가:</span> 
                            <span className="orderBook-highPrice">{formatDecimalsWithCommas(combinedData?.high_price)}원</span>
                        </p>
                        <p>
                            <span>저가:</span> 
                            <span className="orderBook-lowPrice">{formatDecimalsWithCommas(combinedData?.low_price)}원</span>
                        </p>
                        <p>
                            <span>거래량:</span> {Number(combinedData?.acc_trade_price_24h / 1e8).toFixed(2)}억
                        </p>
                    </div>
                </div>

                {/* 좌측 하단 - 보조 정보 */}
                <div className="orderBook-infoContainer">
                    <p>52주 최고가: {combinedData?.highest_52_week_price ? 
                        <span className="orderBook-price-rise">
                            {formatDecimalsWithCommas(combinedData.highest_52_week_price)} 원
                        </span> : '- 원'}</p>
                    {combinedData?.highest_52_week_date && 
                        <p className="orderBook-date-line">
                            ({new Date(combinedData.highest_52_week_date).toLocaleDateString()})
                        </p>
                    }
                    <p>52주 최저가: {combinedData?.lowest_52_week_price ? 
                        <span className="orderBook-price-fall">
                            {formatDecimalsWithCommas(combinedData.lowest_52_week_price)} 원
                        </span> : '- 원'}</p>
                    {combinedData?.lowest_52_week_date && 
                        <p className="orderBook-date-line">
                            ({new Date(combinedData.lowest_52_week_date).toLocaleDateString()})
                        </p>
                    }
                    <p>전일 종가: {combinedData?.prev_closing_price ? 
                        <span className={combinedData?.trade_price > combinedData?.prev_closing_price ? 'orderBook-price-rise' : 
                                         combinedData?.trade_price < combinedData?.prev_closing_price ? 'orderBook-price-fall' : ''}>
                            {formatDecimalsWithCommas(combinedData.prev_closing_price)} 원
                        </span> : '- 원'}</p>
                </div>

                {/* 우측 하단 - 매수호가 */}
                <div className="orderBook-bidContainer">
                    {orderUnits?.map((unit, index) => (
                        <div key={index} className="orderBook-bidPriceDiv">
                            <div>
                                <span>{formatDecimalsWithCommas(unit.bid_price, true)}</span>
                            </div>
                            <div className="orderBook-sizeDiv">
                                <div style={{width: `${(unit.bid_size / maxSize) * 100}%`}}>-</div>
                                <span>{formatDecimalsWithCommas(unit.bid_size, true, 3)}</span>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </>
    )
}