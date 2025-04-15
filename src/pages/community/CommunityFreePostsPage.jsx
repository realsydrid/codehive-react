import CommunityNavbar from "./CommunityNavbar.jsx";
import {useSearchParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import CommunityCreatePostForm from "./CommunityCreatePostForm.jsx";
import ErrorMsg from "./ErrorMsg.jsx";
import {GetFreePosts} from "./CommunityFetch.jsx";
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
            const res = await fetch("http://localhost:8801/rest/community/read/free", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ page: page, size: 10 }),
            });
            if (!res.ok) throw new Error(res.status + "");
            const data = await res.json();

            // 로딩 시간 살짝 지연 (예: 최소 500ms 보여주기)
            setTimeout(() => {
                setPosts((prev) => [...prev, ...data.content]);
                setPage((prev) => prev + 1);
                setHasMore(!data.last);
                setIsLoading(false); // 로딩 종료
            }, 1000);
        } catch (err) {
            console.error(err);
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
                {posts.map((post, page) => (
                    <div key={page} className="p-4 border-b">
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