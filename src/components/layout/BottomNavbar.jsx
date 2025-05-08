import {Link} from "react-router-dom";
import {useState} from "react";
import "./BottomNavbar.css"

export default function BottomNavbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    // 각 메뉴 섹션이 열려있는지 상태 관리
    const [expandedMenus, setExpandedMenus] = useState({
        trade: false,
        asset: false,
        community: false,
        news: false
    });
    
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    
    const closeMenu = () => {
        setMenuOpen(false);
    };
    
    // 특정 메뉴 섹션 토글
    const toggleSubmenu = (section) => {
        setExpandedMenus({
            ...expandedMenus,
            [section]: !expandedMenus[section]
        });
    };
    
    return (
        <>
            {menuOpen && (
                <div className="bottomNavbar-blackScreen" onClick={closeMenu}></div>
            )}
            
            <div className={menuOpen ? "bottomNavbar-sideMenu active" : "bottomNavbar-sideMenu"}>
                <div className="bottomNavbar-sideMenu-header">
                    <button className="bottomNavbar-close-btn" onClick={closeMenu}>닫기</button>
                </div>
                <div className="bottomNavbar-sideMenu-content">
                    <ul className="bottomNavbar-menu-list">
                        {/* 거래소 */}
                        <li className="bottomNavbar-menu-section">
                            <div className="bottomNavbar-menu-title" onClick={() => toggleSubmenu('trade')}>
                                <span>거래소</span>
                                <span className="bottomNavbar-expand-icon">{expandedMenus.trade ? '▼' : '▶'}</span>
                            </div>
                            {expandedMenus.trade && (
                                <ul className="bottomNavbar-submenu-list">
                                    <li>
                                        <Link to="/trade?tab=krw" onClick={closeMenu}>
                                            <span>원화</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/trade?tab=holdings" onClick={closeMenu}>
                                            <span>보유</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/trade?tab=favorites" onClick={closeMenu}>
                                            <span>관심</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        
                        {/* 내자산 */}
                        <li className="bottomNavbar-menu-section">
                            <div className="bottomNavbar-menu-title" onClick={() => toggleSubmenu('asset')}>
                                <span>내자산</span>
                                <span className="bottomNavbar-expand-icon">{expandedMenus.asset ? '▼' : '▶'}</span>
                            </div>
                            {expandedMenus.asset && (
                                <ul className="bottomNavbar-submenu-list">
                                    <li>
                                        <Link to="/asset/my-asset" onClick={closeMenu}>
                                            <span>보유자산</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/asset/history" onClick={closeMenu}>
                                            <span>거래내역</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/asset/pending-orders" onClick={closeMenu}>
                                            <span>미체결</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        
                        {/* 커뮤니티 */}
                        <li className="bottomNavbar-menu-section">
                            <div className="bottomNavbar-menu-title" onClick={() => toggleSubmenu('community')}>
                                <span>커뮤니티</span>
                                <span className="bottomNavbar-expand-icon">{expandedMenus.community ? '▼' : '▶'}</span>
                            </div>
                            {expandedMenus.community && (
                                <ul className="bottomNavbar-submenu-list">
                                    <li>
                                        <Link to="/community/free" onClick={closeMenu}>
                                            <span>자유게시판</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/community/pnl" onClick={closeMenu}>
                                            <span>손익인증게시판</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/community/chart" onClick={closeMenu}>
                                            <span>차트분석게시판</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/community/expert" onClick={closeMenu}>
                                            <span>전문가게시판</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        
                        {/* 뉴스 */}
                        <li className="bottomNavbar-menu-section">
                            <div className="bottomNavbar-menu-title" onClick={() => toggleSubmenu('news')}>
                                <span>뉴스</span>
                                <span className="bottomNavbar-expand-icon">{expandedMenus.news ? '▼' : '▶'}</span>
                            </div>
                            {expandedMenus.news && (
                                <ul className="bottomNavbar-submenu-list">
                                    <li>
                                        <Link to="/news" onClick={closeMenu}>
                                            <span>뉴스 홈</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/news/fear-greed-index" onClick={closeMenu}>
                                            <span>공포탐욕지수</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/news/kimchi-premium" onClick={closeMenu}>
                                            <span>가격프리미엄</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/news/market-cap-ranking" onClick={closeMenu}>
                                            <span>시가총액</span>
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        
                        {/* 설정 */}
                        <li className="bottomNavbar-menu-section">
                            <div className="bottomNavbar-menu-title">
                                <Link className="bottomNavbar-menu-setting" to="/settings" onClick={closeMenu}>
                                    <span>설정</span>
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            
            <nav id="bottomNavbar">
                <ul>
                    <li onClick={toggleMenu}>
                        <Link to="#">
                        <img src="/images/reorder-three-outline.png" alt="전체메뉴아이콘"/>
                        <span>전체메뉴</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/trade"}>
                            <img src="/images/trending-up-outline.png" alt="거래소아이콘"/>
                            <span>거래소</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/asset/my-asset"}>
                            <img src="/images/wallet-outline.png" alt="자산아이콘"/>
                            <span>내자산</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/community/free"}>
                            <img src="/images/chat-alt-2.png" alt="커뮤니티아이콘"/>
                            <span>커뮤니티</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/news"}>
                            <img src="/images/newspaper-outline.png" alt="뉴스아이콘"/>
                            <span>뉴스</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}