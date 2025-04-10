import {Link} from "react-router-dom";
export default function SettingsNotificationsPage(){
    return(
        <>
            <h1>알림설정</h1>
            <Link to={"volatility"}>시세변동알림목록</Link>
            <br/>
            <Link to={"target-price"}>지정가변동알림목록</Link>
        </>
    )
}