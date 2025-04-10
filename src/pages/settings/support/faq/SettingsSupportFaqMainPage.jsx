import {Link} from "react-router-dom";

export default function SettingsSupportFaqMainPage() {
    return (
        <>
            <h1>자주묻는 질문</h1>
            <Link to={"faqNo"}>디테일 화면</Link>
            <br/>
            <Link to={"search"}>검색결과</Link>
        </>
    );
}