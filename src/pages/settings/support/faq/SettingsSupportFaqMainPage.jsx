import {Link} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";

export default function SettingsSupportFaqMainPage() {
    // const {data:faqs}=useQuery({
    //     queryKey: "faqs",
    //     staleTime: 1000 * 60 *5,
    //     cacheTime: 1000 * 60 * 10,
    //     retry: 1
    //     queryFn:async ()=>{
    //         const URL= "a"
    //     }
    // })
    return (
        <>
            <h1>자주묻는 질문</h1>
            <Link to={"faqNo"}>디테일 화면</Link>
            <br/>
            <Link to={"search"}>검색결과</Link>
        </>
    );
}