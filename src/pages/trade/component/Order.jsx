import {formatDecimalsWithCommas, formatPercentWithDecimals, formatDecimal} from "../../../utils/numberFormat.js";
import './Order.css'
import {useEffect, useState, useRef} from "react";

export default function Order({combinedData, orderBook}) {
    const orderUnits = orderBook?.[0]?.orderbook_units;
    const maxSize = Math.max(...orderUnits.map(unit => Math.max(unit.ask_size, unit.bid_size)));
    const [formActiveTab, setFormActiveTab] = useState("매수");
    
    // 호가창 컨테이너 참조 생성
    const orderBookRef = useRef(null);
    // 사용자가 수동으로 스크롤 했는지 추적
    const userScrolledRef = useRef(false);
    
    const handleFormTabClick = (tab) => {
        setFormActiveTab(tab);
    };
    const [priceInputValue, setPriceInputValue] = useState(combinedData?.trade_price || "");

    useEffect(() => {
        if (combinedData?.trade_price && priceInputValue === "") {
            setPriceInputValue(combinedData.trade_price);
        }
    }, [combinedData, priceInputValue]);
    
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
    
    const [radioTab, setRadioTab] = useState("지정");
    const [amountInputValue, setAmountInputValue] = useState(0);
    const [totalPriceInputValue, setTotalPriceInputValue] = useState(0);
    const handleAmountChange = (e) => {
        setAmountInputValue(e.target.value);
    }
    const handlePriceChange = (e) => {
        setPriceInputValue(e.target.value);
    }
    const handleChecked = (target) => {
        if (target === "지정") {
            setRadioTab("지정")
        } else {
            setRadioTab("시장")
        }

    }
    const handleTotalPriceChange = (e) => {
        setTotalPriceInputValue(e.target.value);

    }

    const adjustPrice = (direction) => {
        // 현재 가격에 기반한 증분 단위 계산
        const getStepByPrice = (price) => {
            const numPrice = Number(price);
            if (numPrice >= 1000000) return 1000;       // 100만원 이상: 1000원
            if (numPrice >= 100000) return 50;          // 10만원 이상: 50원
            if (numPrice >= 10000) return 10;           // 1만원 이상: 10원
            if (numPrice >= 1000) return 1;             // 1000원 이상: 1원
            if (numPrice >= 100) return 0.1;            // 100원 이상: 0.1
            if (numPrice >= 10) return 0.01;            // 10원 이상: 0.01
            if (numPrice >= 1) return 0.001;            // 1원 이상: 0.001
            if (numPrice >= 0.1) return 0.0001;         // 0.1원 이상: 0.0001
            return 0.00001;                             // 0.1원 미만: 0.00001
        };

        setPriceInputValue(prev => {
            const currentPrice = Number(prev);
            const step = getStepByPrice(currentPrice);
            // direction이 1이면 증가, -1이면 감소
            const newPrice = currentPrice + (step * direction);
            return Math.max(0, newPrice); // 음수 방지
        });
    };


    return (
        <>
            <div className="order-contentsContainer">
                <div 
                    ref={orderBookRef} // 참조 연결
                    className={combinedData.change + " order-orderBookContainer"}
                >
                    {orderUnits?.slice().reverse().map((unit, index) => (
                        <div key={index} className="order-askPriceDiv">
                            <div>
                                <span>{formatDecimalsWithCommas(unit.ask_price, true)}</span>
                            </div>
                            <div className="order-sizeDiv">
                                <div style={{ width: `${(unit.ask_size / maxSize) * 100}%` }}>-</div>
                                <span>{formatDecimalsWithCommas(unit.ask_size, true, 3)}</span>
                            </div>
                        </div>
                    ))}
                    {orderUnits?.map((unit, index) => (
                        <div key={index} className="order-bidPriceDiv">
                            <div>
                                <span>{formatDecimalsWithCommas(unit.bid_price, true)}</span>
                            </div>
                            <div className="order-sizeDiv">
                                <div style={{ width: `${(unit.bid_size / maxSize) * 100}%` }}>-</div>
                                <span>{formatDecimalsWithCommas(unit.bid_size, true, 3)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-formContainer">
                    <ul className="order-formNav">
                        <li onClick={() => handleFormTabClick("매수")}
                            className={formActiveTab === "매수" ? "active" : ""}>매수
                        </li>
                        <li onClick={() => handleFormTabClick("매도")}
                            className={formActiveTab === "매도" ? "active" : ""}>매도
                        </li>
                        <li onClick={() => handleFormTabClick("거래내역")}
                            className={formActiveTab === "거래내역" ? "active" : ""}>거래내역
                        </li>
                    </ul>
                    {formActiveTab === "매수" &&
                        <div>
                            <div>
                                <div>
                                    <input type="radio" id="targetPrice" checked={radioTab === "지정"}
                                           onChange={() => handleChecked("지정")}/>
                                    <label htmlFor="targetPrice">지정</label>
                                </div>
                                <div>
                                    <input type="radio" id="currentPrice" checked={radioTab === "시장"}
                                           onChange={() => handleChecked("시장")}/>
                                    <label htmlFor="currentPrice">시장</label>
                                </div>
                            </div>

                            <form>
                                <p><span>주문가능</span><span>0</span><span>원</span></p>
                                {radioTab === "지정" ? (
                                    <>
                                        <div className="order-amountSelectDiv">
                                            <div className="order-amountInputDiv">
                                                <p>
                                                    <span>수량</span><input type="text"
                                                                          onChange={() => handleAmountChange}
                                                                          value={amountInputValue}/>
                                                </p>
                                                <div>비율</div>
                                            </div>
                                        </div>
                                        <div className="order-priceSelectDiv">
                                            <div className="order-priceInputDiv">
                                                <p>
                                                    <span>가격</span><input type="text" onChange={() => handlePriceChange}
                                                                          value={formatDecimalsWithCommas(priceInputValue, true)}/>
                                                </p>
                                                <div>
                                                    <button type="button" onClick={() => adjustPrice(-1)}>-</button>
                                                    <button type="button" onClick={() => adjustPrice(1)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <p><span>총액</span><input type="text" onChange={() => handleTotalPriceChange}
                                                                     value={totalPriceInputValue}/><span>원</span></p>
                                            <div>비율</div>
                                        </div>
                                        <div className="order-totalPriceAddDiv">
                                            <button>+1만</button>
                                            <button>+10만</button>
                                            <button>+100만</button>
                                        </div>
                                        <p><span>예상수량</span><span>0</span><span>BTC</span></p>
                                    </>
                                )}

                                <button type="reset" className="order-resetBtn">초기화</button>
                                <button type="reset" className="order-buyConfirmBtn">매수</button>
                            </form>
                        </div>
                    }

                    {formActiveTab === "매도" &&
                        <p>매도</p>
                    }
                    {formActiveTab === "거래내역" &&
                        <p>거래내역</p>
                    }
                </div>
            </div>
        </>
    )
}