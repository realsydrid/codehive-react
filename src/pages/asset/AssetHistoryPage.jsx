import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AssetNavBar from "./AssetNavBar.jsx";
import './AssetHistoryPage.css';
import { Nav, NavDropdown } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const API = {
    TRANSACTION: "http://localhost:8801/api/transaction/coinTransactions",
    COIN_INFO: "https://api.upbit.com/v1/market/all?is_details=false",
};

export default function LoadAssetHistory() {
    const [combinedData, setCombinedData] = useState([]);
    const [filter, setFilter] = useState({ type: "ALL", startDate: "", endDate: "", market: "" });

    const buildUrl = () => {
        const params = new URLSearchParams({
            userNo: "1",
            transactionState: "COMPLETED"
        });
        if (filter.type !== "ALL") params.append("transactionType", filter.type);
        if (filter.startDate) params.append("startDate", `${filter.startDate}T00:00:00`);
        if (filter.endDate) params.append("endDate", `${filter.endDate}T23:59:59`);
        return `${API.TRANSACTION}?${params.toString()}`;
    };

    const { data: coinTransaction, isLoading: loadingTx, isError: errorTx } = useQuery({
        queryKey: ["coinTransaction", filter],
        queryFn: () => fetch(buildUrl()).then(res => res.json())
    });

    const { data: coinInfo, isLoading: loadingInfo, isError: errorInfo } = useQuery({
        queryKey: ["coinInfo"],
        queryFn: () => fetch(API.COIN_INFO).then(res => res.json())
    });

    useEffect(() => {
        if (!coinTransaction || !coinInfo) return;
        const nameMap = new Map(coinInfo.map(({ market, korean_name }) => [market, korean_name]));
        const merged = coinTransaction.map(tx => ({
            ...tx,
            koreanName: nameMap.get(tx.market) || tx.market
        }));
        setCombinedData(merged);
    }, [coinTransaction, coinInfo]);

    const filteredData = filter.market
        ? combinedData.filter(tx => tx.market === filter.market)
        : combinedData;

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
                                <NavDropdown title="거래 전체">
                                    {['BUY', 'SELL', 'ALL'].map(type => (
                                        <NavDropdown.Item key={type} onClick={() => setFilter(prev => ({ ...prev, type }))}>
                                            {type === 'ALL' ? '거래전체' : type === 'BUY' ? '매수' : '매도'}
                                        </NavDropdown.Item>
                                    ))}
                                </NavDropdown>

                                <NavDropdown title="기간 설정">
                                    {[1, 7, 30].map(days => (
                                        <NavDropdown.Item key={days} onClick={() => {
                                            const today = new Date();
                                            const past = new Date();
                                            past.setDate(today.getDate() - days);
                                            setFilter(prev => ({ ...prev, startDate: past.toISOString().slice(0, 10), endDate: today.toISOString().slice(0, 10) }));
                                        }}>{days}일</NavDropdown.Item>
                                    ))}
                                    <div style={{ padding: "0.5rem 1rem" }}>
                                        <label>시작일: </label>
                                        <input type="date" value={filter.startDate} onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))} /><br />
                                        <label>종료일: </label>
                                        <input type="date" value={filter.endDate} onChange={(e) => setFilter(prev => ({ ...prev, endDate: e.target.value }))} />
                                    </div>
                                </NavDropdown>

                                <NavDropdown title="자산 검색">
                                    <div className="px-3 py-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="자산 검색"
                                            onChange={(e) => setFilter(prev => ({ ...prev, market: e.target.value }))}
                                        />
                                    </div>
                                    <NavDropdown.Divider />
                                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                                        <NavDropdown.Item onClick={() => setFilter(prev => ({ ...prev, market: "" }))}>자산 전체</NavDropdown.Item>
                                        {combinedData
                                            .filter((tx, idx, arr) =>
                                                arr.findIndex(item => item.market === tx.market) === idx &&
                                                (!filter.market ||
                                                    tx.koreanName.toLowerCase().includes(filter.market.toLowerCase()) ||
                                                    tx.market.toLowerCase().includes(filter.market.toLowerCase()))
                                            )
                                            .slice(0, 5)
                                            .map((tx) => (
                                                <NavDropdown.Item key={tx.market} onClick={() => setFilter(prev => ({ ...prev, market: tx.market }))}>
                                                    {tx.koreanName} ({tx.market.replace("KRW-", "")})
                                                </NavDropdown.Item>
                                            ))}
                                    </div>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

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
                        <tr key={tx.id} data-market={tx.market}>
                            <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                            <td className="asset-type">{tx.koreanName}<br />{tx.market.replace("-", "/")}</td>
                            <td className={tx.transactionType === "BUY" ? "transaction-type-buy" : "transaction-type-sell"}>
                                {tx.transactionType === "BUY" ? "매수" : "매도"}
                            </td>
                            <td>{tx.transactionCnt.toLocaleString()}</td>
                            <td>{tx.price.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 8 })} 원</td>
                            <td>{(tx.price * tx.transactionCnt).toLocaleString()} 원</td>
                            <td className={tx.transactionState === "COMPLETED" ? "transaction-status-completed" : "transaction-status-pending"}>
                                {tx.transactionState === "COMPLETED" ? "체결완료" : "미체결"}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
