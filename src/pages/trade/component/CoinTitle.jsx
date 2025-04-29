import {formatDecimalsWithCommas, formatPercentWithDecimals} from "../../../utils/numberFormat.js";
import './CointTitle.css'
import {useState} from "react";

export default function coinTitle({combinedData}) {
    const [btnActive, setBtnActive] = useState(true);

    function favoriteBtnHandler() {
        console.log("버튼클릭")
        setBtnActive((prev) => !prev);


    }


    return (
        <>
            {combinedData && combinedData.market &&
                <div className={"trade-coinTitle"}>

                    <div className={combinedData.change}>
                        <p>{formatDecimalsWithCommas(combinedData.trade_price)}</p>
                        <p>
                            <span>{formatPercentWithDecimals(combinedData.change_rate)}</span>
                            <span>{formatDecimalsWithCommas(combinedData.change_price)}</span>
                        </p>

                    </div>
                    <div>
                        <p>
                            <button
                                onClick={favoriteBtnHandler}
                                type={"button"}
                                className={btnActive ? "trade-coinTitle-FavoriteBtn" : "trade-coinTitle-FavoriteBtnActive"}>
                                관심추가
                            </button>
                            {combinedData.korean_name}
                        </p>
                        <span>{combinedData.market.split("-")[1]}</span>
                    </div>

                </div>
            }
        </>
    )

}