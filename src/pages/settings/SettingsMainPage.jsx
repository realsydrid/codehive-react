import { Link } from "react-router-dom";
import './SettingsMainPage.css';

export default function SettingsMainPage() {
    return (
        <div className="settings-container">
            <h1 className="settings-title">설정</h1>

            <ul className="settings-list">
                <li className="settings-item">
                    <Link to="support" className="settings-link">
                        <span>고객센터</span>
                        <span className="settings-right">{'>'}</span>
                    </Link>
                </li>

                <li className="settings-item">
                    <Link to="notifications" className="settings-link">
                        <span>알림설정</span>
                        <span className="settings-right">{'>'}</span>
                    </Link>
                </li>

                <li className="settings-item">
                    <Link to="privacy-policy" className="settings-link">
                        <span>개인정보 취급방침</span>
                        <span className="settings-right">{'>'}</span>
                    </Link>
                </li>

                <li className="settings-item">
                    <Link to="terms" className="settings-link">
                        <span>서비스 이용약관</span>
                        <span className="settings-right">{'>'}</span>
                    </Link>
                </li>

                <li className="settings-item">
                    <Link to="my-info" className="settings-link">
                        <span>회원정보</span>
                        <span className="settings-right">{'>'}</span>
                    </Link>
                </li>

                <li className="settings-item">
                    <div className="settings-link">
                        <span>버전정보</span>
                        <span className="settings-version">1.0.0.1</span>
                    </div>
                </li>
            </ul>
        </div>
    );
}
