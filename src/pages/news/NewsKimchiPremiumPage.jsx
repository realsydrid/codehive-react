import NewsNavBar from "./NewsNavBar.jsx";


export default function NewsKimchiPremiumPage() {
    return (
        <>
            <NewsNavBar />
            <div>
                    <table>
                        <thead>
                        <tr>
                            <th>코인명</th>
                            <th>업비트 현재가</th>
                            <th>빗썸 현재가</th>
                            <th>바이낸스 환산가</th>
                            <th>OKX 환산가</th>
                            <th>프리미엄 (%)</th>
                        </tr>
                        </thead>
                    </table>
            </div>
        </>
    );
}
