import {useEffect, useRef, useState} from "react";
import {formatDecimalsWithCommas} from "../../../utils/numberFormat.js";

export default function OrderBook({market, orderBook, combinedData}) {
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
        setTotalAmount(formatDecimalsWithCommas(totalPriceInputValue / combinedData?.trade_price, true, 8));
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
            </div>
        </>
    )
}