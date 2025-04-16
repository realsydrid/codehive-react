import CommunityNavbar from "./CommunityNavbar.jsx";
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import CommunityCreatePostForm from "./CommunityCreatePostForm.jsx";
import ErrorMsg from "./ErrorMsg.jsx";
import {GetPosts} from "./CommunityFetch.jsx";
import Loading from "./Loading.jsx";
import {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function CommunityFreePostsPage(){
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const fetchPosts = async () => {
        setIsLoading(true); // 로딩 시작
        try {
            const data = await GetPosts("free"); // await 사용
            setTimeout(() => {
                setPosts((prev) => [...prev, ...data.content]);
                setPage((prev) => prev + 1);
                setHasMore(!data.last); // 마지막 페이지면 false로 바뀜
                setIsLoading(false);
            }, 1000);
            // 로딩 시간 살짝 지연 (최소 1000ms 보여주기)
        } catch (err) {
            console.error("Error fetching posts:", err);
            setIsError(true);
            setIsLoading(false);
        } // data.last: 마지막 페이지 여부
    };

    useEffect(() => {
        if (posts.length === 0) {
            fetchPosts(); // 최초 1회
        }
    }, []);

    return (
        <>
            <CommunityNavbar/>
            <h1>자유 게시판</h1>
            <CommunityCreatePostForm/>
            {isError && <ErrorMsg error={isError}/>}
            <InfiniteScroll
                dataLength={posts.length}
                next={fetchPosts}
                hasMore={hasMore}
                loader={<Loading/>}
                endMessage={<p style={{ textAlign: "center" }}><b>더 이상 게시글이 없습니다.</b></p>}
            >
                {posts.map((post) => (
                    <div key={post.id} className={"PostForm"}>
                        <div className={"UserInfo"}>
                            {/*<span>{post.userNickname}</span>*/}
                        </div>
                        <h3>{post.postCont}</h3>
                        <p>{post.postCreatedAt}</p>
                    </div>
                ))}
            </InfiniteScroll>
            )
            {/*{PostPage && PostPage.content.map((post)=>{*/}
            {/*  return (*/}
            {/*    <div>*/}
            {/*        <span>{post.id}</span>*/}
            {/*        <span>{post.postCont}</span>*/}
            {/*    </div>*/}
            {/*    )*/}
            {/*})}*/}
        </>
    )
}