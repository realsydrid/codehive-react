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


    return (
        <>

            {combinedData && combinedData.market &&
                <div id={"title"}>
                    <div>
                        <p>{combinedData.korean_name}(KRW) <span>{combinedData.market.split("-")[1]}</span></p>
                    </div>
                    <div className={combinedData.change}>
                        <p>{formatDecimalsWithCommas(combinedData.trade_price)}</p>
                        <p>
                            <span>{formatPercentWithDecimals(combinedData.change_rate)}</span>
                            <span>{formatDecimalsWithCommas(combinedData.change_price)}</span>
                        </p>

                    </div>

                </div>
            }
            <div id={"contentsContainer"}>
                <div id={"orderBookContainer"} className={combinedData.change}>
                    {orderUnits?.slice().reverse().map((unit, index) => (
                        <div key={index} className={"askPriceDiv"}>
                            <span>{formatDecimalsWithCommas(unit.ask_price)}</span>
                            <span>||||</span>
                            <span>{formatDecimal(unit.ask_size, 3, true)}</span>
                        </div>
                    ))

                    }
                    {orderUnits?.map((unit, index) => (
                        <div key={index} className={"bidPriceDiv"}>
                            <span>{formatDecimalsWithCommas(unit.bid_price)}</span>
                            <span>||||</span>
                            <span>{formatDecimal(unit.bid_size, 3, true)}</span>
                        </div>
                    ))}
                </div>
                <div id={"formContainer"}>
                    <ul id={"formNav"}>
                        <li onClick={() => handleFormTabClick("매수")}>매수</li>
                        <li onClick={() => handleFormTabClick("매도")}>매도</li>
                        <li onClick={() => handleFormTabClick("거래내역")}>거래내역</li>
                    </ul>
                    {formActiveTab === "매수" &&

                        <div>
                            <div>
                                <div onClick={() => handleRadioTabClick("지정")}>
                                    <input type="radio" id={"targetPrice"} checked={radioTab === "지정"}/>
                                    <label htmlFor="targetPrice">지정</label>
                                </div>
                                <div onClick={() => handleRadioTabClick("시장")}>
                                    <input type="radio" id={"currentPrice"} checked={radioTab === "시장"}/>
                                    <label htmlFor="currentPrice">시장</label>
                                </div>
                            </div>

                            <form>
                                <p><span>주문가능</span><span>0</span><span>원</span></p>
                                {radioTab === "지정" ?(
                                    <>
                                        <div id={"amountSelectDiv"}>
                                        <div id={"amountInputDiv"}>
                                            <p>
                                                <span>수량</span><input type="text" value={0}/>
                                            </p>
                                            <div>비율</div>
                                        </div>
                                    </div>
                                        <div id={"priceSelectDiv"}>
                                        <div id={"priceInputDiv"}>
                                            <p>
                                                <span>가격</span><input type="text"
                                                                      value={initialPrice !== null ? initialPrice : ''}/>
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
                                ):(
                                    <>
                                        <div>
                                            <p><span>총액</span><input type="text" value={0}/><span>원</span></p>
                                            <div>비율</div>
                                        </div>
                                        <div id={"priceAddDiv"}>
                                            <button>+1만</button>
                                            <button>+10만</button>
                                            <button>+100만</button>
                                        </div>
                                        <p><span>예상수량</span><span>0</span><span>BTC</span></p>
                                    </>
                                )}

                                <button type={"reset"} id={"resetBtn"}>초기화</button>
                                <button type={"reset"} id={"buyConfirmBtn"}>매수</button>
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