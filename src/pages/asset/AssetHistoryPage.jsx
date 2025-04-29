import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AssetNavBar from "./AssetNavBar.jsx";
import './AssetHistoryPage.css';
import { Nav, NavDropdown } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { formatDecimalsWithCommas } from "../../utils/numberFormat.js";

const API = {
    TRANSACTION: "http://localhost:8801/api/transaction",
    COIN_INFO: "https://api.upbit.com/v1/market/all?is_details=false",
};

export default function LoadAssetHistory() {
    const [combinedData, setCombinedData] = useState([]);
    const [filter, setFilter] = useState({ type: "ALL", startDate: "", endDate: "", market: "" });
    const [searchInput, setSearchInput] = useState(""); // 🔥 추가
    const [page, setPage] = useState(0);
    const [savedScrollY, setSavedScrollY] = useState(0);

    const buildUrl = () => {
        const params = new URLSearchParams({
            userNo: "1",
            transactionState: "COMPLETED",
            page: page,
            size: 20
        });
        if (filter.type !== "ALL") params.append("transactionType", filter.type);
        if (filter.startDate) params.append("startDate", `${filter.startDate}T00:00:00`);
        if (filter.endDate) params.append("endDate", `${filter.endDate}T23:59:59`);
        return `${API.TRANSACTION}?${params.toString()}`;
    };

    const { data: coinTransaction, isLoading: loadingTx, isError: errorTx } = useQuery({
        queryKey: ["coinTransaction", filter, page],
        queryFn: () => fetch(buildUrl()).then(res => res.json()),
        keepPreviousData: true
    });

    const { data: coinInfo, isLoading: loadingInfo, isError: errorInfo } = useQuery({
        queryKey: ["coinInfo"],
        queryFn: () => fetch(API.COIN_INFO).then(res => res.json())
    });

    useEffect(() => {
        if (!coinTransaction || !coinInfo) return;

        const nameMap = new Map(coinInfo.map(({ market, korean_name }) => [market, korean_name]));

        const merged = coinTransaction.content.map(tx => ({
            ...tx,
            koreanName: nameMap.get(tx.market) || tx.market
        }));

        setCombinedData(prev => {
            const existingIds = new Set(prev.map(item => `${item.id}-${item.transactionDate}`));
            const newUniqueData = merged.filter(tx => !existingIds.has(`${tx.id}-${tx.transactionDate}`));
            return [...prev, ...newUniqueData];
        });

        if (savedScrollY !== 0) {
            window.scrollTo({ top: savedScrollY, behavior: 'auto' });
        }
    }, [coinTransaction, coinInfo]);

    const filteredData = filter.market
        ? combinedData.filter(tx => tx.market === filter.market)
        : combinedData;

    const handleLoadMore = () => {
        setSavedScrollY(window.scrollY);
        setPage(prev => prev + 1);
    };

    const hasMore = coinTransaction?.last === false;

    if (loadingTx || loadingInfo) return <p>로딩 중...</p>;
    if (errorTx || errorInfo) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

    return (
        <>
            <AssetNavBar />
            <div className="asset-history-container">
                <h1 className="asset-history-title">거래내역</h1>

                <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                    <Container>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                {/* 거래 전체 */}
                                <NavDropdown title="거래 전체">
                                    {['BUY', 'SELL', 'ALL'].map(type => (
                                        <NavDropdown.Item key={type} onClick={() => {
                                            setFilter(prev => ({ ...prev, type }));
                                            setCombinedData([]);
                                            setPage(0);
                                        }}>
                                            {type === 'ALL' ? '거래전체' : type === 'BUY' ? '매수' : '매도'}
                                        </NavDropdown.Item>
                                    ))}
                                </NavDropdown>

                                {/* 기간 설정 */}
                                <NavDropdown title="기간 설정">
                                    {[1, 7, 30].map(days => (
                                        <NavDropdown.Item key={days} onClick={() => {
                                            const today = new Date();
                                            const past = new Date();
                                            past.setDate(today.getDate() - days);
                                            setFilter(prev => ({
                                                ...prev,
                                                startDate: past.toISOString().slice(0, 10),
                                                endDate: today.toISOString().slice(0, 10)
                                            }));
                                            setCombinedData([]);
                                            setPage(0);
                                        }}>{days}일</NavDropdown.Item>
                                    ))}
                                    <div style={{ padding: "0.5rem 1rem" }}>
                                        <label>시작일: </label>
                                        <input type="date" value={filter.startDate} onChange={(e) => {
                                            setFilter(prev => ({ ...prev, startDate: e.target.value }));
                                            setCombinedData([]);
                                            setPage(0);
                                        }} /><br />
                                        <label>종료일: </label>
                                        <input type="date" value={filter.endDate} onChange={(e) => {
                                            setFilter(prev => ({ ...prev, endDate: e.target.value }));
                                            setCombinedData([]);
                                            setPage(0);
                                        }} />
                                    </div>
                                </NavDropdown>

                                {/* 자산 검색 */}
                                <NavDropdown title="자산 검색" id="market-search-dropdown">
                                    <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="자산 검색"
                                            value={searchInput}
                                            onChange={(e) => setSearchInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    setFilter(prev => ({ ...prev, market: searchInput }));
                                                }
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <NavDropdown.Divider />
                                    <div style={{ maxHeight: "200px", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
                                        <NavDropdown.Item onClick={() => setFilter(prev => ({ ...prev, market: "" }))}>
                                            자산 전체
                                        </NavDropdown.Item>
                                        {combinedData
                                            .filter((tx, idx, arr) =>
                                                arr.findIndex(item => item.market === tx.market) === idx &&
                                                (!searchInput ||
                                                    tx.koreanName.toLowerCase().includes(searchInput.toLowerCase()) ||
                                                    tx.market.toLowerCase().includes(searchInput.toLowerCase()))
                                            )
                                            .slice(0, 5)
                                            .map((tx) => (
                                                <NavDropdown.Item
                                                    key={tx.market}
                                                    onClick={() => setFilter(prev => ({ ...prev, market: tx.market }))}
                                                >
                                                    {tx.koreanName} ({tx.market.replace("KRW-", "")})
                                                </NavDropdown.Item>
                                            ))}
                                    </div>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                {/* 테이블 출력 */}
                <table className="asset-history-table">
                    <thead>
                    <tr>
                        <th>거래일시</th>
                        <th>자산</th>
                        <th>거래구분</th>
                        <th>거래수량</th>
                        <th>체결가격</th>
                        <th>거래금액</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredData.map((tx) => (
                        <tr key={`${tx.id}-${new Date(tx.transactionDate).getTime()}`}>
                            <td>{new Date(tx.transactionDate).toLocaleString('ko-KR')}</td>
                            <td>{tx.koreanName}<br />{tx.market.replace("-", "/")}</td>
                            <td className={tx.transactionType === "BUY" ? "transaction-type-buy" : "transaction-type-sell"}>
                                {tx.transactionType === "BUY" ? "매수" : "매도"}
                            </td>
                            <td>{tx.transactionCnt.toLocaleString()}</td>
                            <td>{formatDecimalsWithCommas(tx.price, true)} 원</td>
                            <td>{formatDecimalsWithCommas(tx.price * tx.transactionCnt)} 원</td>
                            <td>{tx.transactionState === "COMPLETED" ? "체결완료" : "미체결"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {hasMore && (
                    <div className="text-center my-4">
                        <button className="btn btn-outline-primary" onClick={handleLoadMore}>
                            거래내역 더 보기
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}