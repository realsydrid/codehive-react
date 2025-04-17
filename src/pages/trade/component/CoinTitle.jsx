import {formatDecimalsWithCommas, formatPercentWithDecimals} from "../../../utils/numberFormat.js";

export default function coinTitle({combinedData}) {
    return (
        <>
            {combinedData && combinedData.market &&
            <div className={"order-title"}>
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
        </>
    )

}