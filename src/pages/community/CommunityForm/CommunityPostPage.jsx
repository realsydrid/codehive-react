import Loading from "./Loading.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link} from "react-router-dom";
import "../CommunityPost.css";
import InfinitePageNationData from "../CommunityHook/InfinitePageNationData.js";
import {PostLikeComponent} from "../CommunityComponents/LikePostComponent.jsx";
import {useContext, useEffect, useState} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";

//InfiniteScroll 만을 썼다가 InfiniteQuery+InfiniteScroll 을 사용하니 중복도 피해지고
// 캐싱된 좋아요 싫어요 데이터도 서버에서 불러옴과 동시에 Optimistic Update 구조도 불러와짐
export default function CommunityPostsPage({category}){
    const [loginUser,]=useContext(UseLoginUserContext);
    const [isLoadingUser, setIsLoadingUser] = useState(true); // 로그인 상태 로딩 상태
    useEffect(() => {
        if (loginUser !== null) {
            setIsLoadingUser(false); // 로그인 정보가 로딩되면 지연 렌더링 해제
        }
    }, [loginUser]);
    const loginUserNo=loginUser?.id

        const {
            data,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isError,
            isLoading
        } = InfinitePageNationData(category);

        const posts = data?.pages.flatMap(page => page.content) ?? [];

        if (isError) return <div>에러가 발생했습니다.</div>;
        if (isLoading && posts.length === 0) return <Loading />;

        return (
            <InfiniteScroll
                dataLength={posts.length}
                next={fetchNextPage}
                hasMore={hasNextPage}
                loader={isFetchingNextPage && <Loading/>}
                style={{
                    width: "100%",
                    minWidth: "20rem",
                    maxWidth: "100rem",
                    display: "flex",
                    alignItems: "center"
                }}
                className="infiniteScrolls"
                endMessage={
                    <p style={{ textAlign: "center" }}>
                        <b>더 이상 게시글이 없습니다.</b>
                    </p>
                }
            >
                {posts.map((post) => (
                    <div key={post.id} className={"infiniteScrolls"}>
                        <div className={"Community-UserInfo"}>
                            <Link to={"/users/profile/" + post.userNo} className={"Community-PostLink"}>
                                <img src={post.userProfileImgUrl ? post.userProfileImgUrl : "/images/user_icon_default.png"} alt=""
                                     className={"Community-ProfileImg"}/>
                                <div>
                                    <span>{post.userNickname}</span>
                                    <span>Lv.{post.userNo}</span>
                                </div>
                            </Link>
                        </div>
                        <div className={"Community-list-group"}>
                            <div className={"Community-PostInside"}>
                                <Link to={`/community/posts/${post.id}`} className={"Community-PostLink"}>
                                    <h2 className={"Community-postForm"}>{post.postCont}</h2>
                                </Link>
                                <div>
                                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                        <span style={{display: "flex", alignItems: "flex-end"}}>{post.postCreatedAt}</span>
                                        <div style={{display: "flex", alignItems: "flex-end", flexDirection: "column"}} >
                                            <PostLikeComponent loginUserNo={loginUserNo} post={post} disabled={isLoadingUser}/>
                                            <span style={{display: "flex", alignItems: "flex-end"}}>댓글 {post.commentCount}개</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
    )
}