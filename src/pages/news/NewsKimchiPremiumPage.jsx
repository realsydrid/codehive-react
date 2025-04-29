import { useEffect, useState } from "react";
import NewsNavBar from "./NewsNavBar.jsx";
import "./NewsKimchiPremiumPage.css";

const UPBIT_API = "https://api.upbit.com/v1/ticker?markets=";
const BINANCE_API = "https://api.binance.com/api/v3/ticker/price";
const COIN_NAME_API = "https://api.upbit.com/v1/market/all?isDetails=false";
const EXCHANGE_API = import.meta.env.VITE_EXCHANGE_API_URL;

const formatPrice = (price) => {
    if (price >= 1000) {
        return Math.round(price).toLocaleString();
    } else if (price >= 1) {
        return price.toFixed(2);
    } else {
        return price.toFixed(4);
    }
};

const getPremiumClass = (premiumPercent) => {
    if (premiumPercent >= 3) {
        return "premium-high";
    } else if (premiumPercent <= -3) {
        return "premium-low";
    } else {
        return "premium-neutral";
    }
};

export default function NewsKimchiPremiumPage() {
    const [coinData, setCoinData] = useState([]);
    const [conversionRate, setConversionRate] = useState(null);
    const [error, setError] = useState("");
    const [isDescending, setIsDescending] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const exchangeRes = await fetch(EXCHANGE_API);
                const exchangeJson = await exchangeRes.json();
                const rate = exchangeJson.conversion_rate;

                const coinNameRes = await fetch(COIN_NAME_API);
                const coinNameJson = await coinNameRes.json();
                const krwMarkets = coinNameJson.filter(c => c.market.startsWith("KRW-"));
                const marketList = krwMarkets.map(c => c.market).join(",");

                const koreanNameMap = {};
                krwMarkets.forEach(c => {
                    koreanNameMap[c.market.replace("KRW-", "")] = c.korean_name;
                });

                const upbitRes = await fetch(UPBIT_API + marketList);
                const upbitJson = await upbitRes.json();
                const upbitPriceMap = {};
                upbitJson.forEach(c => {
                    upbitPriceMap[c.market.replace("KRW-", "")] = c.trade_price;
                });

                const binanceRes = await fetch(BINANCE_API);
                const binanceJson = await binanceRes.json();
                const binancePriceMap = {};
                binanceJson.forEach(c => {
                    if (c.symbol.endsWith("USDT")) {
                        binancePriceMap[c.symbol.replace("USDT", "")] = parseFloat(c.price);
                    }
                });

                const combinedData = Object.keys(upbitPriceMap)
                    .filter(symbol => binancePriceMap[symbol])
                    .map(symbol => {
                        const upbitPrice = upbitPriceMap[symbol];
                        const binancePrice = binancePriceMap[symbol] * rate;
                        const priceGap = upbitPrice - binancePrice;
                        const premiumPercent = (priceGap / binancePrice) * 100;
                        return {
                            name: koreanNameMap[symbol] || symbol,
                            symbol,
                            upbitPrice: formatPrice(upbitPrice),
                            binancePrice: formatPrice(binancePrice),
                            priceGapRaw: priceGap,
                            premiumPercentRaw: premiumPercent,
                            priceGap: (priceGap >= 0 ? "+" : "") + formatPrice(priceGap),
                            premiumPercent: (premiumPercent >= 0 ? "+" : "") + premiumPercent.toFixed(2),
                            premiumClass: getPremiumClass(premiumPercent)
                        };
                    });

                setConversionRate(rate);
                setCoinData(combinedData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    const filteredData = coinData
        .filter(coin =>
            coin.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchKeyword.toLowerCase())
        )
        .sort((a, b) => isDescending
            ? b.premiumPercentRaw - a.premiumPercentRaw
            : a.premiumPercentRaw - b.premiumPercentRaw
        );

    return (
        <>
            <NewsNavBar />
            <div className="premium-container">
                <h1 className="news-title">가격 프리미엄</h1>
                <p className="mt-5">적용 환율: {conversionRate ? conversionRate : "불러오는 중..."}</p>

                <div className="controls">
                    <input
                        type="text"
                        placeholder="코인명 검색"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="search-input"
                    />
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isDescending}
                            onChange={() => setIsDescending(!isDescending)}
                        />
                        <span className="slider"></span>
                    </label>
                    <span className="sort-label">{isDescending ? "프리미엄 높은 순" : "프리미엄 낮은 순"}</span>
                </div>

                {error && <p className="error-message">{error}</p>}

                <table className="premium-table">
                    <thead>
                    <tr>
                        <th>코인명</th>
                        <th>업비트</th>
                        <th>바이낸스</th>
                        <th>가격차이</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((coin) => (
                        <tr key={coin.symbol}>
                            <td>{coin.name} ({coin.symbol})</td>
                            <td>{coin.upbitPrice}</td>
                            <td>{coin.binancePrice}</td>
                            <td className={coin.premiumClass}>
                                <div className="premium-percent">{coin.premiumPercent}%</div>
                                <div className="price-gap">{coin.priceGap} ₩</div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}