import {Link} from "react-router-dom";

export default function SettingsMainPage() {
    return (
        <>
            <h1>설정 메인페이지</h1>
            <Link to={"support"}>고객센터</Link>
            <br/>
            <Link to={"notifications"}>알림설정</Link>
            <br/>
            <Link to={"my-info"}>내정보</Link>
            <br/>
            <Link to={"privacy-policy"}>개인정보취급방침</Link>
            <br/>
            <Link to={"terms"}>이용약관</Link>
        </>
    )

}