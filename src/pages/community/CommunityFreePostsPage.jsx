import CommunityNavbar from "./CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityCreatePostForm.jsx";
import ErrorMsg from "./ErrorMsg.jsx";
import {GetPosts} from "./CommunityFetch.jsx";
import Loading from "./Loading.jsx";
import {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link} from "react-router-dom";

export default function CommunityFreePostsPage(){
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        fetchPosts(); // 초기 로딩 1회만 실행
    }, []); // 의존성 배열 비워야 합니다

    const fetchPosts = async () => {
        if (isLoading) return; // 중복 방지
        setIsLoading(true);

        try {
            const data = await GetPosts('free', page);
            setPosts(prev => [...prev, ...data.content]);
            setHasMore(!data.last);
            setPage(prev => prev + 1); // 다음 페이지 준비!
        } catch (e) {
            console.error(e);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <CommunityNavbar/>
            <Link to="/community/search">검색</Link>
            <h1 style={{marginTop:"100px"}}>자유 게시판</h1>
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
                    <div key={post.id} className={"AllPostForm"}>
                        <div className={"UserInfo"}>
                            <Link to={"/users/profile/" + post.userId}>
                                <img src={post.userProfileImgUrl ? post.userProfileImgUrl : "/images/user_icon_default.png"} alt=""/>
                            <span>{post.userNickname}</span>
                            <span>Lv.{post.userId}</span>
                            </Link>
                        </div>
                        <div className={"postForm"}>
                            <Link to={`/community/posts/${post.id}`}>
                        <h2>{post.postCont}<img src={post.imgUrl ? "/images/ImageIcon.png" : null} alt=""
                            style={{width:"20px",height:"20px",display:post.imgUrl ? "" : "none"}}/></h2>
                        <span>{post.postCreatedAt}</span>
                            <div className={"postInfo"}>
                                <button type={"button"} >좋아요{post.likeCount}개</button>
                                <button type={"button"}>싫어요{post.dislikeCount}개</button>
                                <span>댓글{post.commentCount}개</span>
                            </div>
                            </Link>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
            )
        </>
    )
}