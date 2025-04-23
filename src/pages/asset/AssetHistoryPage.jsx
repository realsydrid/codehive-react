import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AssetNavBar from "./AssetNavBar.jsx";
import './AssetHistoryPage.css';
import {Nav, NavDropdown} from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function LoadAssetHistory() {
    const [combinedData, setCombinedData] = useState([]);
    const [filterType, setFilterType] = useState("ALL");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const API_BASE_URL = 'http://localhost:8801/api/transaction/coinTransactions';
    const apiUrl = `${API_BASE_URL}?userNo=1&transactionState=COMPLETED`
        + (filterType === "ALL" ? "" : `&transactionType=${filterType}`)
        + (startDate ? `&startDate=${startDate}T00:00:00` : "")
        + (endDate ? `&endDate=${endDate}T23:59:59` : "");

    const { data: coinTransaction, isLoading: isLoading1, isError: isError1 } = useQuery({
        queryKey: ["coinTransaction", filterType, startDate, endDate],
        queryFn: async () => {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error("거래 내역 불러오기 실패");
            return res.json();
        }
    });

    const { data: coinInfo, isLoading: isLoading2, isError: isError2 } = useQuery({
        queryKey: ["coinInfo"],
        queryFn: async () => {
            const res = await fetch("https://api.upbit.com/v1/market/all?is_details=false");
            if (!res.ok) throw new Error("코인 정보 불러오기 실패");
            return res.json();
        }
    });

    useEffect(() => {
        if (coinTransaction && coinInfo) {
            const map = new Map();
            coinInfo.forEach((coin) => {
                map.set(coin.market, coin.korean_name);
            });

            const merged = (coinTransaction || []).map(tx => ({
                ...tx,
                koreanName: map.get(tx.market) || tx.market
            }));

            setCombinedData(merged);
        }
    }, [coinTransaction, coinInfo]);

    if (isLoading1 || isLoading2) return <p>로딩 중...</p>;
    if (isError1 || isError2) return <p>데이터를 불러오는 중 오류가 발생했습니다.</p>;

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
                                <NavDropdown title="거래 전체" id="collapsible-nav-dropdown">
                                    <NavDropdown.Item onClick={() => setFilterType("BUY")}>매수</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => setFilterType("SELL")}>매도</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => setFilterType("ALL")}>거래전체</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="기간 설정" id="collapsible-nav-dropdown">
                                    <NavDropdown.Item onClick={() => {
                                        const today = new Date();
                                        const yesterday = new Date();
                                        yesterday.setDate(today.getDate() - 1);
                                        setStartDate(yesterday.toISOString().slice(0, 10));
                                        setEndDate(today.toISOString().slice(0, 10));
                                    }}>1일</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => {
                                        const today = new Date();
                                        const weekAgo = new Date();
                                        weekAgo.setDate(today.getDate() - 7);
                                        setStartDate(weekAgo.toISOString().slice(0, 10));
                                        setEndDate(today.toISOString().slice(0, 10));
                                    }}>7일</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={() => {
                                        const today = new Date();
                                        const monthAgo = new Date();
                                        monthAgo.setDate(today.getDate() - 30);
                                        setStartDate(monthAgo.toISOString().slice(0, 10));
                                        setEndDate(today.toISOString().slice(0, 10));
                                    }}>30일</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <div style={{ padding: "0.5rem 1rem" }}>
                                        <label>시작일: </label>
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            style={{ marginBottom: "0.5rem" }}
                                        />
                                        <br />
                                        <label>종료일: </label>
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
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
                    {combinedData.map((tx) => (
                        <tr key={tx.id}>
                            <td>{new Date(tx.transactionDate).toLocaleString()}</td>
                            <td className="asset-type">
                                {tx.koreanName}<br />{tx.market.replace("-", "/")}
                            </td>
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
