import {formatDecimalsWithCommas, formatDecimal} from "../../../utils/numberFormat.js";
import './Order.css'
import {useEffect, useState, useRef} from "react";
import {useQuery} from "@tanstack/react-query";

export default function Order({combinedData, orderBook}) {
    const orderUnits = orderBook?.[0]?.orderbook_units;
    const maxSize = Math.max(...orderUnits.map(unit => Math.max(unit.ask_size, unit.bid_size)));
    const [formActiveTab, setFormActiveTab] = useState("매수");
    const [totalAmount, setTotalAmount] = useState(0);

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
        // 소수점 이하 금액 반올림하여 정수로 변환
        const totalPrice = Math.round(e.target.value * priceInputValue);
        setTotalPriceInputValue(formatDecimalsWithCommas(totalPrice, false, 0)); // 소수점 없이 표시
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
        // 소수점이 있다면 반올림
        const roundedValue = Math.round(parseFloat(inputValue));
        setTotalPriceInputValue(formatDecimalsWithCommas(roundedValue, false, 0));
    };
    useEffect(() => {
        setTotalAmount(formatDecimalsWithCommas(totalPriceInputValue / combinedData?.trade_price, true,8));
    }, [combinedData?.trade_price, totalPriceInputValue]);


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
            const currentPrice = Number(prev.replace(/,/g, ''));
            const newPrice = Math.round(currentPrice + Number(price));
            setTotalAmount(formatDecimal(newPrice / combinedData?.trade_price, 8));
            return formatDecimalsWithCommas(newPrice, false, 0);
        });
    }

    const resetHandler = () => {
        setTotalPriceInputValue(0);
        setTotalAmount(0);
        setAmountInputValue(0);
    }

    // const loginQuery = useQuery({
    //     queryFn: async () => {
    //         try {
    //             const loginUser= await loadLogin(user)
    //             setLoginUser(()=>loginUser);
    //             navigate("/");
    //             return loginUser;
    //         } catch (e) {
    //             console.log(e)
    //             throw new Error("아이디와 비밀번호를 확인하세요!")
    //         }
    //     },
    //     queryKey: ["loginUser", user.id],
    //     retry: 1,
    //     staleTime: 1000 * 60 * 5,
    //     cacheTime: 1000 * 60 * 10,
    //     enabled: false,
    // })
    const BUY_URL="http://localhost:8801/trade/api/transaction";
    const handleBuyRequest=async ()=> {
        if (
            (radioTab === "지정" && (!priceInputValue || !amountInputValue)) ||
            (radioTab === "시장" && !totalPriceInputValue)
        ) {
            alert("입력값이 없습니다!");
            return;
        }

        // 가격에서 콤마 제거하고 정수로 변환
        const priceValue = radioTab === "지정" 
            ? Math.round(Number(String(priceInputValue).replace(/,/g, '')))
            : Math.round(combinedData.trade_price);
        
        // 총액에서 콤마 제거
        const totalPrice = String(totalPriceInputValue).replace(/,/g, '');

        const transaction = {
            userNo: 1,
            market: combinedData.market,
            transactionType: formActiveTab === "매수" ? "BUY" : "SELL",
            price: priceValue, // Long 타입으로 보낼 정수 값
            transactionCnt: radioTab === "지정" ? Number(amountInputValue) : Number(totalAmount),
            transactionState: "PENDING",
            // 필요하다면 총액도 추가
            transactionAmount: Math.round(Number(totalPrice))
        };

        try {
            const response = await fetch(BUY_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(transaction),
            });

            if (response.ok) {
                alert("거래성공!@!@");
                resetHandler();
                console.log(transaction);
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



    return (
        <>
            <div className="order-contentsContainer">
                <div
                    ref={orderBookRef}
                    className={combinedData.change + " order-orderBookContainer"}
                >
                    {orderUnits?.slice().reverse().map((unit, index) => (
                        <div key={index} className="order-askPriceDiv">
                            <div>
                                <span>{formatDecimalsWithCommas(unit.ask_price, true)}</span>
                            </div>
                            <div className="order-sizeDiv">
                                <div style={{width: `${(unit.ask_size / maxSize) * 100}%`}}>-</div>
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
                                                                          onChange={handleAmountChange}
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
                                        <p><span>총액</span><input type="text" onChange={handleTotalPriceChange}
                                                                 value={totalPriceInputValue}/><span>원</span></p>
                                        <div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <p><span>총액</span><input type="text" onChange={handleTotalPriceChange}
                                                                     value={totalPriceInputValue}/><span>원</span></p>
                                            <div>비율</div>
                                        </div>
                                        <div className="order-totalPriceAddDiv">
                                            <button type="button" onClick={() => adjustTotalPrice(10000)}>+1만</button>
                                            <button type="button" onClick={() => adjustTotalPrice(100000)}>+10만</button>
                                            <button type="button" onClick={() => adjustTotalPrice(1000000)}>+100만
                                            </button>
                                        </div>
                                        <p>
                                            <span>예상수량</span>
                                            <input readOnly="readOnly" value={totalAmount}/>
                                            <span>{combinedData.market ? combinedData.market.split("-")[1] : ""}</span>
                                        </p>
                                    </>
                                )}

                                <button type="reset" onClick={resetHandler} className="order-resetBtn">초기화</button>
                                <button type="button" onClick={handleBuyRequest} className="order-buyConfirmBtn">매수</button>
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