import {formatDecimalsWithCommas, formatPercentWithDecimals, formatDecimal} from "../../../utils/numberFormat.js";
import './Order.css'
import {useEffect, useState} from "react";

export default function Order({combinedData, orderBook}) {
    const orderUnits = orderBook?.[0]?.orderbook_units;
    const [formActiveTab, setFormActiveTab] = useState("매수");
    const handleFormTabClick = (tab) => {
        setFormActiveTab(tab);
    };
    const [initialPrice, setInitialPrice] = useState(null);
    useEffect(() => {
        if (combinedData && combinedData.trade_price && initialPrice === null) {
            setInitialPrice(combinedData.trade_price);
        }
    }, [combinedData, initialPrice]);
    const [radioTab, setRadioTab] = useState("지정");
    const [checked, setChecked] = useState(true);
    const handleRadioTabClick = (tab) => {
        setRadioTab(tab);
    }
    const [amountInputValue, setAmountInputValue] = useState(0);
    const handleAmountChange= (e)=>{
        setAmountInputValue(e.target.value);
    }

    return (
        <>
            <div className="order-contentsContainer">
                <div className={combinedData.change + " order-orderBookContainer"}>
                    {orderUnits?.slice().reverse().map((unit, index) => (
                        <div key={index} className="order-askPriceDiv">
                            <span>{formatDecimalsWithCommas(unit.ask_price)}</span>
                            <span>||||</span>
                            <span>{formatDecimal(unit.ask_size, 3, true)}</span>
                        </div>
                    ))}
                    {orderUnits?.map((unit, index) => (
                        <div key={index} className="order-bidPriceDiv">
                            <span>{formatDecimalsWithCommas(unit.bid_price)}</span>
                            <span>||||</span>
                            <span>{formatDecimal(unit.bid_size, 3, true)}</span>
                        </div>
                    ))}
                </div>
                <div className="order-formContainer">
                    <ul className="order-formNav">
                        <li onClick={() => handleFormTabClick("매수")} className={formActiveTab === "매수" ? "active" : ""}>매수</li>
                        <li onClick={() => handleFormTabClick("매도")} className={formActiveTab === "매도" ? "active" : ""}>매도</li>
                        <li onClick={() => handleFormTabClick("거래내역")} className={formActiveTab === "거래내역" ? "active" : ""}>거래내역</li>
                    </ul>
                    {formActiveTab === "매수" &&
                        <div>
                            <div>
                                <div onClick={() => handleRadioTabClick("지정")}>
                                    <input type="radio" id="targetPrice" checked={radioTab === "지정"} onChange={() => {}}/>
                                    <label htmlFor="targetPrice">지정</label>
                                </div>
                                <div onClick={() => handleRadioTabClick("시장")}>
                                    <input type="radio" id="currentPrice" checked={radioTab === "시장"} onChange={() => {}}/>
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
                                                    <span>수량</span><input type="text" onChange={handleAmountChange} value={amountInputValue}/>
                                                </p>
                                                <div>비율</div>
                                            </div>
                                        </div>
                                        <div className="order-priceSelectDiv">
                                            <div className="order-priceInputDiv">
                                                <p>
                                                    {/*<span>가격</span><input type="text" value={initialPrice !== null ? initialPrice : ''}/>*/}
                                                </p>
                                                <div>
                                                    <button>-</button>
                                                    <button>+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <p><span>총액</span><input type="text" onChange={handleAmountChange} value={amountInputValue}/><span>원</span></p>
                                            <div>비율</div>
                                        </div>
                                        <div className="order-priceAddDiv">
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