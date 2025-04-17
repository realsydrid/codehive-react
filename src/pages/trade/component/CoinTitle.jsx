import {formatDecimalsWithCommas, formatPercentWithDecimals} from "../../../utils/numberFormat.js";
import './CointTitle.css'

export default function coinTitle({combinedData}) {
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
                    <p>{combinedData.korean_name}(KRW)</p>
                    <span>{combinedData.market.split("-")[1]}</span>
                </div>

            </div>
            }
        </>
    )

}