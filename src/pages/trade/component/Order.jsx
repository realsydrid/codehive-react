import {formatDecimalsWithCommas, formatPercentWithDecimals} from "../../../utils/numberFormat.js";
export default function Order({combinedData}) {


    return (
        <>

            {combinedData && combinedData.market ? (
                <div>
                    <p>{combinedData.korean_name}(KRW) <span>{combinedData.market.split("-")[1]}</span></p>
                    <p className={combinedData.change}>{formatDecimalsWithCommas(combinedData.trade_price)} <span>{formatDecimalsWithCommas(combinedData.change_price)}</span> <span>{formatPercentWithDecimals(combinedData.change_rate)}</span></p>
                </div>

            ):(
                <div>로딩중~~</div>
            )}
        </>
    )

}