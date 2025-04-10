import {Link} from "react-router-dom";

export default function SettingsSupportNoticeMainPage() {
    return (
        <>
            <h1>공지사항</h1>
            <Link to={"noticeNo"}>디테일 화면</Link>
            <br/>
            <Link to={"search"}>검색결과 화면</Link>

        </>
    );
}