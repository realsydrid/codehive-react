import {formatDecimalsWithCommas, formatDecimal} from "../../../utils/numberFormat.js";
import './Order.css'
import {useEffect, useState, useRef} from "react";
import {useQuery} from "@tanstack/react-query";
import {Ratio} from "react-bootstrap";


const RATIO_FRAME = {
    PERCENT10: {value: 0.1, display: '10%'},
    PERCENT20: {value: 0.2, display: '20%'},
    PERCENT30: {value: 0.3, display: '30%'},
    PERCENT40: {value: 0.4, display: '40%'},
    PERCENT50: {value: 0.5, display: '50%'},
    PERCENT60: {value: 0.6, display: '60%'},
    PERCENT70: {value: 0.7, display: '70%'},
    PERCENT80: {value: 0.8, display: '80%'},
    PERCENT90: {value: 0.9, display: '90%'},
    PERCENT100: {value: 1, display: '최대'},
}

export default function Order({combinedData, orderBook}) {
    const orderUnits = orderBook?.[0]?.orderbook_units;
    const maxSize = Math.max(...orderUnits.map(unit => Math.max(unit.ask_size, unit.bid_size)));
    const [formActiveTab, setFormActiveTab] = useState("매수");
    const [totalAmount, setTotalAmount] = useState(0);
    const [ratio, setRatio] = useState('');
    const [deposit, setDeposit] = useState(0);
    const [remainCnt, setRemainCnt] = useState(0);

    const handleSelectChange = (e) => {
        const selectedRatio = e.target.value;
        setRatio(selectedRatio);
        applyRatio(selectedRatio);
    }
    // 호가창 컨테이너 참조 생성
    const orderBookRef = useRef(null);
    // 사용자가 수동으로 스크롤 했는지 추적
    const userScrolledRef = useRef(false);

    const handleFormTabClick = (tab) => {
        setFormActiveTab(tab);
        handleChecked();
        setRadioTab("지정");
        
        // 탭 전환 시 입력값 초기화
        setAmountInputValue(0);
        setFormattedAmountValue("0");
        setRawInputValue("0");
        setTotalPriceInputValue('');
        setTotalAmount(0);
        setRatio('');
        
        // 현재 시세로 가격 초기화
        if (combinedData?.trade_price) {
            setPriceInputValue(combinedData.trade_price);
        }
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
    const [formattedAmountValue, setFormattedAmountValue] = useState("0");
    const [rawInputValue, setRawInputValue] = useState("0"); // 원본 입력값 저장
    const [amountInputFocused, setAmountInputFocused] = useState(false);
    const [totalPriceInputValue, setTotalPriceInputValue] = useState('');
    
    // 수량 입력값 변경 시 포맷팅된 값도 함께 업데이트
    const updateAmountValue = (value) => {
        const numericValue = parseFloat(value) || 0;
        const maxAmount = getMaxAmount();
        
        // 최대값을 초과하는 경우 최대값으로 조정
        let adjustedValue = numericValue;
        if (formActiveTab === "매도" && adjustedValue > remainCnt) {
            adjustedValue = remainCnt;
        } else if (formActiveTab === "매수" && adjustedValue > maxAmount) {
            adjustedValue = maxAmount;
        }
        
        setAmountInputValue(adjustedValue);
        setRawInputValue(adjustedValue.toString()); // 원본 입력값 저장
        // 포맷팅된 값 업데이트 - 기본 옵션만 사용
        setFormattedAmountValue(formatDecimalsWithCommas(adjustedValue));
        
        // 총액도 함께 업데이트
        const totalPrice = Math.round(adjustedValue * priceInputValue);
        setTotalPriceInputValue(formatDecimalsWithCommas(totalPrice));
    };
    
    const handleAmountChange = (e) => {
        // 입력값에서 콤마 제거
        const value = e.target.value.replace(/,/g, '');
        // 숫자 또는 소수점만 허용
        if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
            // 사용자가 직접 수량을 수정하면 선택된 비율 초기화
            setRatio('');
            
            const numericValue = parseFloat(value) || 0;
            const maxAmount = getMaxAmount();
            
            // 최대값 체크
            let finalValue = numericValue;
            let useMaxValue = false;
            
            // 최대값을 초과하는 경우 최대값으로 조정
            if (formActiveTab === "매도" && numericValue > remainCnt) {
                finalValue = remainCnt;
                useMaxValue = true;
                console.log('최대값 초과 감지! 최대값으로 조정:', finalValue);
            } else if (formActiveTab === "매수" && numericValue > maxAmount) {
                finalValue = maxAmount;
                useMaxValue = true;
                console.log('최대값 초과 감지! 최대값으로 조정:', finalValue);
            }
            
            // 유효한 입력값만 상태 업데이트
            setAmountInputValue(finalValue);
            
            // 최대값 초과시 최대값으로 설정, 그렇지 않으면 원본 입력값 유지
            setRawInputValue(useMaxValue ? finalValue.toString() : value);
            
            // 포맷팅된 값도 업데이트 (포커스 없을 때 표시용)
            setFormattedAmountValue(formatDecimalsWithCommas(finalValue));
            
            // 총액 업데이트
            const totalPrice = Math.round(finalValue * priceInputValue);
            setTotalPriceInputValue(formatDecimalsWithCommas(totalPrice));
        }
    }
    
    const handleAmountFocus = () => {
        setAmountInputFocused(true);
    }
    
    const handleAmountBlur = () => {
        setAmountInputFocused(false);
        
        // 포커스를 잃을 때 입력값 정리
        const numericValue = parseFloat(rawInputValue) || 0;
        setAmountInputValue(numericValue);
        setRawInputValue(numericValue.toString());
        setFormattedAmountValue(formatDecimalsWithCommas(numericValue));
    }
    
    const handlePriceChange = (e) => {
        setPriceInputValue(e.target.value);
    }
    const handleChecked = (target) => {
        if (target === "지정") {
            setRadioTab("지정")
            setAmountInputValue(0);
            setTotalPriceInputValue(0);
        } else {
            setRadioTab("시장")
            setTotalPriceInputValue(0);
            setTotalAmount(0);
        }

    }
    const handleTotalPriceChange = (e) => {
        // 입력값에서 콤마 제거하고 숫자로 변환
        const inputValue = e.target.value.replace(/,/g, '');
        
        // 입력값이 비어있으면 빈 문자열로 설정
        if (!inputValue) {
            setTotalPriceInputValue('');
            setAmountInputValue(0); // 수량도 0으로 설정
            setFormattedAmountValue("0");
            setRawInputValue("0");
            return;
        }
        
        const numericValue = parseFloat(inputValue) || 0;
        
        // 매수의 경우 최대 입력값을 deposit으로 제한
        if (formActiveTab === "매수") {
            if (numericValue > deposit) {
                setTotalPriceInputValue(formatDecimalsWithCommas(deposit, false, 0));
                
                // 수량 계산 및 업데이트 (지정가 주문일 때)
                if (radioTab === "지정" && priceInputValue && priceInputValue !== 0) {
                    const calculatedAmount = deposit / priceInputValue;
                    setAmountInputValue(calculatedAmount);
                    setRawInputValue(calculatedAmount.toString());
                    setFormattedAmountValue(formatDecimalsWithCommas(calculatedAmount));
                } else if (radioTab === "시장" && combinedData?.trade_price) {
                    // 시장가일 때는 totalAmount 계산
                    const estimatedAmount = deposit / combinedData.trade_price;
                    setTotalAmount(formatDecimalsWithCommas(estimatedAmount, true, 8));
                }
                return;
            }
        } 
        // 매도의 경우 계산된 수량이 remainCnt를 초과하지 못하도록 제한
        else if (formActiveTab === "매도" && radioTab === "지정" && priceInputValue && priceInputValue !== 0) {
            const calculatedAmount = numericValue / priceInputValue;
            if (calculatedAmount > remainCnt) {
                // 최대 remainCnt만큼만 판매 가능
                const maxTotal = Math.round(remainCnt * priceInputValue);
                setTotalPriceInputValue(formatDecimalsWithCommas(maxTotal, false, 0));
                setAmountInputValue(remainCnt);
                setRawInputValue(remainCnt.toString());
                setFormattedAmountValue(formatDecimalsWithCommas(remainCnt));
                return;
            }
        }
        
        // 소수점이 있다면 반올림, NaN 방지를 위해 || 0 추가
        const roundedValue = Math.round(numericValue);
        setTotalPriceInputValue(formatDecimalsWithCommas(roundedValue, false, 0));
        
        // 수량 계산 및 업데이트
        if (radioTab === "지정" && priceInputValue && priceInputValue !== 0) {
            const calculatedAmount = roundedValue / priceInputValue;
            setAmountInputValue(calculatedAmount);
            setRawInputValue(calculatedAmount.toString());
            setFormattedAmountValue(formatDecimalsWithCommas(calculatedAmount));
        } else if (radioTab === "시장" && combinedData?.trade_price) {
            // 시장가일 때는 totalAmount 계산
            const estimatedAmount = roundedValue / combinedData.trade_price;
            setTotalAmount(formatDecimalsWithCommas(estimatedAmount, true, 8));
        }
    };
    useEffect(() => {
        // 쉼표 제거 후 파싱, 빈 값이나 NaN일 경우 0으로 설정
        const numericValue = totalPriceInputValue ? totalPriceInputValue.replace(/,/g, '') : '0';
        const roundedValue = Math.round(parseFloat(numericValue) || 0);
        
        // 시장가 주문일 때만 totalAmount 업데이트 (수량 예측)
        if (radioTab === "시장") {
            setTotalAmount(formatDecimalsWithCommas(roundedValue / combinedData?.trade_price, true, 8));
        }
    }, [combinedData?.trade_price, totalPriceInputValue, radioTab]);


    const adjustPrice = (direction) => {
        // 현재 가격에 기준 증감조절
        const getStepByPrice = (price) => {
            const numPrice = Number(price);
            if (numPrice >= 1000000) return 1000;
            if (numPrice >= 100000) return 50;
            if (numPrice >= 10000) return 10;
            if (numPrice >= 1000) return 1;
            if (numPrice >= 100) return 0.1;
            if (numPrice >= 10) return 0.01;
            if (numPrice >= 1) return 0.001;
            if (numPrice >= 0.1) return 0.0001;
            return 0.00001;
        };

        setPriceInputValue(prev => {
            const currentPrice = Number(prev);
            const step = getStepByPrice(currentPrice);
            const newPrice = currentPrice + (step * direction);
            // 총액 계산 시 소수점 이하 반올림
            const totalPrice = Math.round(Number(amountInputValue) * newPrice);
            setTotalPriceInputValue(formatDecimalsWithCommas(totalPrice, false, 0));
            return Math.max(0, newPrice);
        });
    };


    const adjustTotalPrice = (price) => {
        setTotalPriceInputValue(prev => {
            // prev가 문자열이 아닌 경우를 처리
            const prevStr = String(prev || '');
            const currentPrice = Number(prevStr.replace(/,/g, '') || 0);
            const newPrice = Math.round(currentPrice + Number(price));
            console.log(newPrice);
            setTotalAmount(formatDecimalsWithCommas(newPrice / combinedData?.trade_price, true, 8));
            return formatDecimalsWithCommas(newPrice, false, 0);
        });
    }

    // 수량 입력 필드에 사용할 최대값 계산 함수
    const getMaxAmount = () => {
        if (formActiveTab === "매도") {
            return remainCnt;
        } else if (formActiveTab === "매수" && priceInputValue && priceInputValue !== 0) {
            // deposit을 정확히 사용할 수 있도록 소수점 이하 자리수 추가
            // 여유를 더 크게 설정 (1% -> 2%)
            return (deposit / priceInputValue) * 0.98;
        }
        return Number.MAX_SAFE_INTEGER; // 기본값
    }

    const resetHandler = () => {
        setTotalPriceInputValue('');
        setTotalAmount(0);
        setAmountInputValue(0);
        setFormattedAmountValue("0");
        setRawInputValue("0");
        setRatio('');
    }

    const BUY_URL = "http://localhost:8801/api/trade/me";
    const handleBuyRequest = async () => {
        if (
            (radioTab === "지정" && (!priceInputValue || !amountInputValue)) ||
            (radioTab === "시장" && !totalPriceInputValue)
        ) {
            alert("입력값이 없습니다!");
            return;
        }

        const priceValue = radioTab === "지정"
            ? Math.round(Number(String(priceInputValue).replace(/,/g, '')))
            : Math.round(combinedData.trade_price);

        const totalPrice = String(totalPriceInputValue).replace(/,/g, '');

        const transaction = {
            market: combinedData.market,
            transactionType: formActiveTab === "매수" ? "BUY" : "SELL",
            price: priceValue, // Long 타입
            transactionCnt: radioTab === "지정" ? Number(amountInputValue) : Number(totalAmount),
            // transactionState: "PENDING",
            // transactionAmount: Math.round(Number(totalPrice))
        };

        try {
            const response = await fetch(BUY_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(transaction),
            });

            if (response.ok) {
                alert("거래성공!@!@");
                resetHandler();
                console.log(transaction);
                
                // 거래 성공 후 잔액과 코인 수량 업데이트
                fetchDeposit();
                if (formActiveTab === "매도") {
                    fetchRemainCnt();
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                alert(`거래오류!!!! 오류: ${errorData.message || response.status}`);
                console.log(transaction)
            }
        } catch (error) {
            console.log(error);
            alert("네트워크오류!?!")
        }
    };

    // 잔액(deposit) 정보 가져오기 함수
    const fetchDeposit = async () => {
        try {
            const response = await fetch("http://localhost:8801/api/trade/me/deposit", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("잔액:", data);
                setDeposit(data);
            } else {
                console.error("Failed to fetch deposit:", response.status);
            }
        } catch (error) {
            console.error("Error fetching deposit:", error);
        }
    };

    // 남은 코인 수량 가져오기 함수
    const fetchRemainCnt = async () => {
        if (!combinedData?.market) return;
        
        try {
            const response = await fetch(`http://localhost:8801/api/trade/me/remainCnt?market=${combinedData.market}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                console.log("남은 코인 수량:", data);
                setRemainCnt(data);
            } else {
                console.error("남은 코인 수량을 가져오는데 실패했습니다:", response.status);
            }
        } catch (error) {
            console.error("남은 코인 수량 API 호출 오류:", error);
        }
    };

    // 초기 잔액 로드
    useEffect(() => {
        fetchDeposit();
    }, []);

    // 선택된 코인이 변경되거나 formActiveTab이 '매도'로 변경될 때 남은 코인 수량 가져오기
    useEffect(() => {
        // 매도 탭이고 선택된 코인이 있을 때만 실행
        if (formActiveTab === "매도" && combinedData?.market) {
            fetchRemainCnt();
        }
    }, [formActiveTab, combinedData?.market]);

    // RATIO_FRAME 비율 적용 함수
    const applyRatio = (ratio) => {
        if (!ratio) return;
        
        const maxValue = getMaxAmount();
        let newAmount = maxValue * ratio;
        
        // 코인 가격에 따라 적절한 소수점 자릿수로 제한
        let decimalPlaces = 4; // 기본 자릿수
        
        if (priceInputValue) {
            const price = parseFloat(priceInputValue);
            if (price >= 10000000) decimalPlaces = 2; // 1천만원 이상
            else if (price >= 1000000) decimalPlaces = 3; // 100만원 이상
            else if (price >= 100000) decimalPlaces = 4; // 10만원 이상
            else if (price >= 10000) decimalPlaces = 5; // 1만원 이상
            else if (price >= 1000) decimalPlaces = 6; // 1천원 이상
            else decimalPlaces = 8; // 저가 코인
        }
        
        // 소수점 자릿수 제한 적용
        newAmount = parseFloat(newAmount.toFixed(decimalPlaces));
        
        // 숫자 값과 포맷팅된 값 모두 업데이트
        updateAmountValue(newAmount);
    }

    // 호가창 가격 클릭 시 처리하는 함수
    const handleOrderBookPriceClick = (price) => {
        setPriceInputValue(price);
        
        // 수량이 입력되어 있을 경우 총액도 함께 계산
        if (amountInputValue && amountInputValue > 0) {
            const totalPrice = Math.round(amountInputValue * price);
            setTotalPriceInputValue(formatDecimalsWithCommas(totalPrice, false, 0));
        }
    };

    return (
        <>
            <div className="order-contentsContainer">
                <div
                    ref={orderBookRef}
                    className={combinedData.change + " order-orderBookContainer"}
                >
                    {orderUnits?.slice().reverse().map((unit, index) => (
                        <div key={index} className="order-askPriceDiv">
                            <div onClick={() => handleOrderBookPriceClick(unit.ask_price)} style={{ cursor: 'pointer' }}>
                                <span>{formatDecimalsWithCommas(unit.ask_price, true)}</span>
                            </div>
                            <div onClick={() => handleOrderBookPriceClick(unit.ask_price)} className="order-sizeDiv">
                                <div style={{width: `${(unit.ask_size / maxSize) * 100}%`}}>-</div>
                                <span>{formatDecimalsWithCommas(unit.ask_size, true, 3)}</span>
                            </div>
                        </div>
                    ))}
                    {orderUnits?.map((unit, index) => (
                        <div key={index} className="order-bidPriceDiv">
                            <div onClick={() => handleOrderBookPriceClick(unit.bid_price)} style={{ cursor: 'pointer' }}>
                                <span>{formatDecimalsWithCommas(unit.bid_price, true)}</span>
                            </div>
                            <div onClick={() => handleOrderBookPriceClick(unit.bid_price)} className="order-sizeDiv">
                                <div style={{width: `${(unit.bid_size / maxSize) * 100}%`}}>-</div>
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
                            <div className="order-formRadioNav">
                                <div>
                                    <input type="radio" id="targetPrice" checked={radioTab === "지정"}
                                           onChange={() => handleChecked("지정")}/>
                                    <label htmlFor="targetPrice"
                                           className={radioTab === "지정" ? "active" : ""}>지정</label>
                                </div>
                                <div>
                                    <input type="radio" id="currentPrice" checked={radioTab === "시장"}
                                           onChange={() => handleChecked("시장")}/>
                                    <label htmlFor="currentPrice"
                                           className={radioTab === "시장" ? "active" : ""}>시장</label>
                                </div>
                            </div>

                            <form className="order-buyForm">
                                <div className="order-depositDiv">
                                    <span>주문가능</span>
                                    <div>
                                        <span>{formatDecimalsWithCommas(deposit, false)}</span><span> 원</span>
                                    </div>
                                </div>
                                {radioTab === "지정" ? (
                                    <>
                                        <div className="order-amountSelectDiv">
                                            <p>
                                                <span>수량</span><input type="text"
                                                                      onChange={handleAmountChange}
                                                                      onFocus={handleAmountFocus}
                                                                      onBlur={handleAmountBlur}
                                                                      value={rawInputValue}/>
                                            </p>
                                            <select
                                                value={ratio}
                                                onChange={handleSelectChange}>
                                                <option value="" disabled hidden>
                                                    비율
                                                </option>
                                                {Object.entries(RATIO_FRAME).map(([key, {display, value}]) => (
                                                    <option key={key} value={value}>
                                                        {display}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="order-priceSelectDiv">
                                            <p>
                                                <span>가격</span><input type="text" onChange={() => handlePriceChange}
                                                                      value={formatDecimalsWithCommas(priceInputValue, true)}/>
                                            </p>
                                            <div>
                                                <button type="button" onClick={() => adjustPrice(-1)}>-</button>
                                                <button type="button" onClick={() => adjustPrice(1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="order-totalPriceDiv">
                                            <p>
                                                <span>총액</span>
                                                <input 
                                                    type="text" 
                                                    onChange={handleTotalPriceChange}
                                                    value={totalPriceInputValue}
                                                />
                                                <span className="order-unit">원</span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="order-totalPriceDiv">
                                            <p>
                                                <span>총액</span>
                                                <input 
                                                    type="text" 
                                                    onChange={handleTotalPriceChange}
                                                    value={totalPriceInputValue}
                                                />
                                                <span className="order-unit">원</span>
                                            </p>
                                        </div>
                                        <div className="order-totalPriceAddDiv">
                                            <button type="button" onClick={() => adjustTotalPrice(10000)}>+1만</button>
                                            <button type="button" onClick={() => adjustTotalPrice(100000)}>+10만</button>
                                            <button type="button" onClick={() => adjustTotalPrice(1000000)}>+100만
                                            </button>
                                        </div>
                                        <div className="order-amountSelectDiv">
                                        <p>
                                            <span>예상수량</span>
                                                <input 
                                                    readOnly="readOnly" 
                                                    value={totalAmount}
                                                    style={{ paddingRight: "4rem" }}
                                                />
                                                <span className="order-unit">
                                                    {combinedData.market ? combinedData.market.split("-")[1] : ""}
                                                </span>
                                        </p>
                                        </div>
                                    </>
                                )}
                                <div className="order-submitBtnDiv">
                                    <button type="reset" onClick={resetHandler} className="order-resetBtn">초기화</button>
                                    <button type="button" onClick={handleBuyRequest} className="order-buyConfirmBtn">매수
                                    </button>
                                </div>
                            </form>
                        </div>
                    }

                    {formActiveTab === "매도" &&
                        <div>
                            <div className="order-formRadioNav">
                                <div>
                                    <input type="radio" id="targetPriceSell" checked={radioTab === "지정"}
                                           onChange={() => handleChecked("지정")}/>
                                    <label htmlFor="targetPriceSell"
                                           className={radioTab === "지정" ? "active" : ""}>지정</label>
                                </div>
                                <div>
                                    <input type="radio" id="currentPriceSell" checked={radioTab === "시장"}
                                           onChange={() => handleChecked("시장")}/>
                                    <label htmlFor="currentPriceSell"
                                           className={radioTab === "시장" ? "active" : ""}>시장</label>
                                </div>
                            </div>

                            <form className="order-sellForm">
                                <div className="order-depositDiv">
                                    <span>주문가능</span>
                                    <div>
                                        <span>{formatDecimalsWithCommas(remainCnt, false, 8)}</span><span> {combinedData.market ? combinedData.market.split("-")[1] : ""}</span>
                                    </div>
                                </div>
                                {radioTab === "지정" ? (
                                    <>
                                        <div className="order-amountSelectDiv">
                                            <p>
                                                <span>수량</span><input type="text"
                                                                      onChange={handleAmountChange}
                                                                      onFocus={handleAmountFocus}
                                                                      onBlur={handleAmountBlur}
                                                                      value={rawInputValue}/>
                                            </p>
                                            <select
                                                value={ratio}
                                                onChange={handleSelectChange}>
                                                <option value="" disabled hidden>
                                                    비율
                                                </option>
                                                {Object.entries(RATIO_FRAME).map(([key, {display, value}]) => (
                                                    <option key={key} value={value}>
                                                        {display}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="order-priceSelectDiv">
                                            <p>
                                                <span>가격</span><input type="text" onChange={() => handlePriceChange}
                                                                      value={formatDecimalsWithCommas(priceInputValue, true)}/>
                                            </p>
                                            <div>
                                                <button type="button" onClick={() => adjustPrice(-1)}>-</button>
                                                <button type="button" onClick={() => adjustPrice(1)}>+</button>
                                            </div>
                                        </div>
                                        <div className="order-totalPriceDiv">
                                            <p>
                                                <span>총액</span>
                                                <input 
                                                    type="text" 
                                                    onChange={handleTotalPriceChange}
                                                    value={totalPriceInputValue}
                                                />
                                                <span className="order-unit">원</span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="order-totalPriceDiv">
                                            <p>
                                                <span>총액</span>
                                                <input 
                                                    type="text" 
                                                    onChange={handleTotalPriceChange}
                                                    value={totalPriceInputValue}
                                                />
                                                <span className="order-unit">원</span>
                                            </p>
                                        </div>
                                        <div className="order-totalPriceAddDiv">
                                            <button type="button" onClick={() => adjustTotalPrice(10000)}>+1만</button>
                                            <button type="button" onClick={() => adjustTotalPrice(100000)}>+10만</button>
                                            <button type="button" onClick={() => adjustTotalPrice(1000000)}>+100만
                                            </button>
                                        </div>
                                        <div className="order-amountSelectDiv">
                                        <p>
                                            <span>예상수량</span>
                                                <input 
                                                    readOnly="readOnly" 
                                                    value={totalAmount}
                                                    style={{ paddingRight: "4rem" }}
                                                />
                                                <span className="order-unit">
                                                    {combinedData.market ? combinedData.market.split("-")[1] : ""}
                                                </span>
                                        </p>
                                        </div>
                                    </>
                                )}
                                <div className="order-submitBtnDiv">
                                    <button type="reset" onClick={resetHandler} className="order-resetBtn">초기화</button>
                                    <button type="button" onClick={handleBuyRequest} className="order-sellConfirmBtn">매도
                                    </button>
                                </div>
                            </form>
                        </div>
                    }
                    {formActiveTab === "거래내역" &&
                        <p>거래내역</p>
                    }
                </div>
            </div>
        </>
    )
}