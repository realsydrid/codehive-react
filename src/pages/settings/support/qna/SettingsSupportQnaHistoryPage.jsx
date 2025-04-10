import {Link} from "react-router-dom";
export default function SettingsSupportQnaHistoryPage() {
    return (
        <>
            <h1>문의 내역</h1>
            <Link to={"/settings/support/qna/questionNo"}>문의내역디테일</Link>
        </>
    );
}