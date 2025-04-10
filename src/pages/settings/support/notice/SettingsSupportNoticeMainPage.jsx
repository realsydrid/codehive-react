import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

export default function SettingsSupportNoticeMainPage() {
    // const {data:notices}=useQuery({
    //     queryKey: "notices",
    //     staleTime: 1000*60*5,
    //     cacheTime: 1000*60*10,
    //     retry: 1
    //     queryFn: async ()=> {
    //         const URL=""
    //     }
    // });
    return (
        <>
            <h1>공지사항</h1>햣
            <Link to={"noticeNo"}>디테일 화면</Link>
            <br/>
            <Link to={"search"}>검색결과 화면</Link>
        </>
    );
}