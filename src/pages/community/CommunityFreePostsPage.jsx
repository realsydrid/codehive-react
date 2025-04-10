import CommunityNavbar from "./CommunityNavbar.jsx";
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import CommunityCreatePostForm from "./CommunityCreatePostForm.jsx";
import ErrorMsg from "./ErrorMsg.jsx";
import {getPosts} from "./CommunityFetch.jsx";

export default function CommunityFreePostsPage(){
    // const [searchParams,setSearchParams]=useSearchParams();
    // const page=searchParams.get("page") || 1; //null 일때 1 대입
    // const size=searchParams.get("size") || 10;
    // const category=searchParams.get("category") || 'free';
    // const {data:PostPage,Loading,error}=useQuery({
    //     queryKey:["PostPage",page,size],
    //     queryFn:async ()=>getPosts(page,size,category),
    //     staleTime:1000*60*5,
    //     cachedTime:1000*60*10,
    //     retry:1,
    // })

    return (
        <>
            <CommunityNavbar/>
            <h1>자유 게시판</h1>
            <CommunityCreatePostForm/>
            {/*{Loading && <Loading/>}*/}
            {/*{error && <ErrorMsg error={error}/>}*/}
            {/*{PostPage && PostPage.content.map((post)=>{*/}
            {/*    <p>{post.postCont}</p>*/}
            {/*})}*/}
        </>
    )
}