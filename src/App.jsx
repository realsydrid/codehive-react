import {BrowserRouter, Routes, Route} from 'react-router-dom';
import HomePage from "./pages/HomePage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import TradeMainPage from "./pages/trade/TradeMainPage.jsx";
import TradeOrderPage from "./pages/trade/TradeMainPage.jsx";
import TradeAskingPricePage from "./pages/trade/TradeAskingPricePage.jsx";
import TradeChartPage from "./pages/trade/TradeChartPage.jsx";
import TradePricePage from "./pages/trade/TradePricePage.jsx";
import TradeInfoPage from "./pages/trade/TradeInfoPage.jsx";
import './App.css';
import CommunityFreePostsPage from "./pages/community/CommunityFreePostsPage.jsx";
import CommunityChartPostsPage from "./pages/community/CommunityChartPostsPage.jsx";
import CommunityPnlPostsPage from "./pages/community/CommunityPnlPostsPage.jsx";
import CommunityPostDetailPage from "./pages/community/CommunityPostDetailPage.jsx";
import CommunityPostModifyPage from "./pages/community/CommunityPostModifyPage.jsx";
import CommunitySearchPage from "./pages/community/CommunitySearchPage.jsx";
import CommunityExpertPostsPage from "./pages/community/CommunityExpertPostsPage.jsx";
import UsersProfilePage from "./pages/users/UsersProfilePage.jsx";
import UsersProfileFollowingsPage from "./pages/users/UsersProfileFollowingsPage.jsx";
import UsersProfileFollowersPage from "./pages/users/UsersProfileFollowersPage.jsx";
import UsersProfileBoardsPage from "./pages/users/UsersProfileBoardsPage.jsx";



function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout/>}>
                    <Route path="/" element={<HomePage/>}/> {/*홈*/}

                    {/*trade*/}
                    <Route path="/trade">
                        <Route index element={<TradeMainPage/>}/> {/*거래소 메인페이지에서 원화,보유,관심*/}
                        <Route path="order/:market" element={<TradeOrderPage/>}/> {/*오더페이지에서 매수 매도 내역 구현*/}
                        <Route path="asking-price/:market" element={<TradeAskingPricePage/>}/> {/*호가*/}
                        <Route path="chart/:market" element={<TradeChartPage/>}/> {/*차트*/}
                        <Route path="price/:market" element={<TradePricePage/>}/> {/*시세*/}
                        <Route path="info/:market" element={<TradeInfoPage/>}/> {/*정보*/}
                    </Route>

                    {/*/!*asset*!/*/}
                    {/*<Route path="/asset">*/}
                    {/*    <Route path="my-asset" element={<AssetMyAssetPage/>}/>/!*나의자산*!/*/}
                    {/*    <Route path="history" element={<AssetHistoryPage/>}/>/!*거래내역*!/*/}
                    {/*    <Route path="pending-orders" element={<AssetPendingOrdersPage/>}/>/!*미체결*!/*/}
                    {/*</Route>*/}

                    {/*community*/}
                    <Route path="/community">
                        <Route path="free" element={<CommunityFreePostsPage/>}/>
                        <Route path="chart" element={<CommunityChartPostsPage/>}/>
                        <Route path="expert" element={<CommunityExpertPostsPage/>}/>
                        <Route path="pnl" element={<CommunityPnlPostsPage/>}/>

                        <Route path="posts/:postNo" element={<CommunityPostDetailPage/>}/>
                        <Route path="posts/:postNo/modify" element={<CommunityPostModifyPage/>}/>
                        <Route path="search" element={<CommunitySearchPage/>}/>
                    </Route>

                    {/*news*/}
                    {/*    <Route path="posts/:postNo" element={<CommunityPostDetailPage/>}/>*/}
                    {/*    <Route path="posts/:postNo/modify" element={<CommunityPostModifyPage/>}/>*/}
                    {/*    <Route path="search" element={<CommunitySearchPage/>}/>*/}
                    {/*</Route>*/}

                    {/*<Route path="/news">*/}
                    {/*    <Route index element={<NewsMainPage/>}/> /!*뉴스메인(전체뉴스,암호화폐,해외증시,환율/금리)*!/*/}

                    {/*    <Route path="fear-greed-index" element={<NewsFearGreedIndexPage/>}/> /!*공탐지수*!/*/}
                    {/*    <Route path="kimchi-premium" element={<NewsKimchiPremiumPage/>}/> /!*김프*!/*/}
                    {/*    <Route path="futures">*/}
                    {/*        <Route index element={<FuturesMainPage/>}/> /!*선물메인페이지(진입메뉴페이지)*!/*/}

                    {/*        <Route path="liquidations" element={<FuturesLiquidationsPage/>}/> /!*강제청산비율*!/*/}
                    {/*        <Route path="long-short" element={<FuturesLongShortPage/>}/> /!*롱숏비율*!/*/}
                    {/*        <Route path="open-interest" element={<FuturesOpenInterestPage/>}/> /!*미결제약정*!/*/}
                    {/*    </Route>*/}
                    {/*</Route>*/}


                    {/*settings*/}
                    {/*<Route path="/settings">*/}
                    {/*    <Route index element={<SettingsMainPage/>}/>*/}
                        {/*고객센터*/}
                        {/*<Route path="support">*/}
                        {/*    <Route index element={<SettingsSupportMainPage/>}/> /!*고객센터메인*!/*/}

                        {/*    <Route path="notice">*/}
                        {/*        <Route index element={<SettingsSupportNoticeMainPage/>}/> /!*공지사항메인*!/*/}
                        {/*        <Route path=":noticeNo" element={<SettingsSupportNoticeDetailPage/>}/> /!*공지사항디테일*!/*/}
                        {/*        <Route path="search" element={<SettingsSupportNoticeSearchPage/>}/> /!*공지사항검색결과*!/*/}
                        {/*    </Route>*/}

                        {/*    <Route path="faq">*/}
                        {/*        <Route index element={<SettingsSupportFaqMainPage/>}/> /!*자주묻는질문메인*!/*/}
                        {/*        <Route path=":faqNo" element={<SettingsSupportFaqDetailPage/>}/> /!*자주묻는질문디테일*!/*/}
                        {/*        <Route path="search" element={<SettingsSupportFaqSearchPage/>}/> /!*자주묻는질문검색결과*!/*/}
                        {/*    </Route>*/}

                        {/*    <Route path="qna">*/}
                        {/*        <Route path="write" element={<SettingsQnaWritePage/>}/> /!*1:1문의작성하기*!/*/}
                        {/*        <Route path="history" element={<SettingsQnaHistoryPage/>}/> /!*문의내역(답변대기,답변완료)*!/*/}
                        {/*        <Route path=":questionNo" element={<SettingsQnaQuestionDetailPage/>}/> /!*문의내역디테일*!/*/}
                        {/*    </Route>*/}
                        {/*</Route>*/}
                        {/*/!*알림*!/*/}
                        {/*<Route path="notifications">*/}
                        {/*    <Route index element={<SettingsNotificationsPage/>}/> /!*알림설정*!/*/}
                        {/*    <Route path="volatility" element={<SettingsNotificationsVolatilityPage/>}/> /!*시세변동알림목록*!/*/}
                        {/*    <Route path="target-price" element={<SettingsNotificationsTargetPricePage/>}/> /!*지정가변동알림목록*!/*/}
                        {/*</Route>*/}
                        {/*/!*내정보*!/*/}
                        {/*<Route path="my-info" element={<SettingsMyInfoPage/>}/>*/}
                        {/*/!*개인정보취급방침*!/*/}
                        {/*<Route path="privacy-policy" element={<SettingsPrivacyPolicyPage/>}/>*/}
                        {/*/!*이용약관*!/*/}
                        {/*<Route path="terms" element={<SettingsTermsPage/>}/>*/}
                    {/*</Route>*/}


                    {/*users*/}
                    <Route path="/users">
                        <Route path="profile/:userNo" element={<UsersProfilePage/>}/>
                        <Route path="profile/:userNo/followings" element={<UsersProfileFollowingsPage/>}/>
                        <Route path="profile/:userNo/followers" element={<UsersProfileFollowersPage/>}/>
                        <Route path="profile/:userNo/boards" element={<UsersProfileBoardsPage/>}/>
                    </Route>

                </Route>
            </Routes>
        </BrowserRouter>

    )
}

export default App
