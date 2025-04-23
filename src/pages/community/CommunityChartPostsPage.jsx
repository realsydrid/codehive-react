import CommunityNavbar from "./CommunityNavbar.jsx";
import CommunityCreatePostForm from "./CommunityForm/CommunityCreatePostForm.jsx";
import ErrorMsg from "./ErrorMsg.jsx";
import {GetPosts} from "./CommunityUtil/CommunityFetch.js";
import Loading from "./Loading.jsx";
import {useEffect, useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link} from "react-router-dom";
import "./CommunityPost.css";

export default function CommunityChartPostsPage(){
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [size, setSize] = useState(10);
    useEffect(() => {
        fetchPosts(); // 초기 로딩 1회만 실행
    }, []); // 의존성 배열 비워야 합니다

    const fetchPosts = async () => {
        if (isLoading) return; // 중복 방지
        setIsLoading(true);

        try {
            const data = await GetPosts('chart', page,size);
            setPosts(prev => [...prev, ...data.content]);
            setHasMore(!data.last);
            setPage(prev => prev + 1); // 다음 페이지 준비!
            setSize(size)
        } catch (e) {
            console.error(e);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={"container"}>
            <CommunityNavbar/>
            <div>
                <Link to="/community/search">검색</Link>
                <h1 style={{marginTop:"50px"}}>자유 게시판</h1>
                <CommunityCreatePostForm category='free' userNo={1}/>
                {/*<CommunityCreatePostForm category="free" userNo="loginUserNo"/>*/}
                {isError && <ErrorMsg error={isError}/>}

                <InfiniteScroll
                    dataLength= {posts.length}
                    next={fetchPosts}
                    hasMore={hasMore}
                    loader={<Loading/>}
                    endMessage={<p style={{ textAlign: "center" }}><b>더 이상 게시글이 없습니다.</b></p>}
                    className={"d-flex flex-md-column align-items-center"}
                >
                    {posts.map((post) => (
                        <div key={post.id} className={"justify-content-center align-items-center mb-2"} style={{width:'80%', minWidth:'800px'}}>
                            <div className={"Community-UserInfo"}>
                                <Link to={"/users/profile/" + post.userNo} className={"Community-Link"}>
                                    <img src={post.userProfileImgUrl ? post.userProfileImgUrl : "/images/user_icon_default.png"} alt=""
                                         className={"Community-ProfileImg"}/>
                                    <div>
                                        <span>{post.userNickname}</span>
                                        <span>Lv.{post.userNo}</span>
                                    </div>
                                </Link>
                            </div>
                            <div className={"Community-list-group"}>
                                <Link to={`/community/posts/${post.id}`} className={"Community-Link"}>
                                    <div className={"Community-postForm"}>
                                        <h2>{post.postCont}<img src={post.imgUrl ? "/images/ImageIcon.png" : null} alt=""
                                                                style={{width:"20px",height:"20px",display:post.imgUrl ? "" : "none"}}/></h2>
                                        <div className={"Community-postInfo"}>
                                            <div>
                                                <button type={"button"}>좋아요{post.likeCount}개</button>
                                                <button type={"button"}>싫어요{post.dislikeCount}개</button>
                                                <span>댓글{post.commentCount}개</span>
                                            </div>
                                            <div>{post.postCreatedAt}</div>
                                        </div>
                                    </div>
                                </Link>
                            </div></div>
                    ))}
                </InfiniteScroll>

                )
            </div>
        </div>
    )
}