import {Link} from "react-router-dom";

export default function TopNavbar() {
    return (
        <>
            <nav id="topNavbar">
                <div>
                    <a href="/">
                        <img src="/images/sample_logo.svg" alt="비트하이브로고"/>
                    </a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src="/images/user_icon_default.png" alt="프로필로고" />
                    <Link to="/login">로그인</Link>
                </div>
            </nav>
        </>
    );
}