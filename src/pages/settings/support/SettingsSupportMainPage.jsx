import {Link} from "react-router-dom";

export default function SettingsSupportMainPage() {
    return (
        <>
            <h1>고객센터 메인 페이지</h1>
            <Link to={"notice"}>공지사항</Link>
            <br/>
            <Link to={"faq"}>자주묻는질문</Link>
            <br/>
            <Link to={"qna/write"}>1:1 문의하기</Link>
            <br/>
            <Link to={"qna/history"}>문의내역</Link>
        </>
    );
}