import { Link } from "react-router-dom";
import './SettingsSupportMainPage.css';

export default function SettingsSupportMainPage() {
    return (
        <div className="support-container">
            <div className="support-title">고객 센터</div>
            <div className="support-grid">
                <Link to="notice" className="support-card">
                    공지사항 및 가이드
                    <span>거래소 이용 관련 가이드</span>
                </Link>
                <Link to="faq" className="support-card">
                    자주하는 질문
                    <span>거래소 이용 관련 자주하는 질문</span>
                </Link>
                <Link to="qna/write" className="support-card">
                    1:1 문의하기
                    <span>고객센터 24시간 운영</span>
                </Link>
                <Link to="qna/history" className="support-card">
                    문의내역
                    <span>1:1 문의내역 확인</span>
                </Link>
            </div>
        </div>
    );
}
