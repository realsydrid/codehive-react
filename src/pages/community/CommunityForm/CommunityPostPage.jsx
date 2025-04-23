import ErrorMsg from "../ErrorMsg.jsx";
import Loading from "../Loading.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link} from "react-router-dom";
import "../CommunityPost.css";
import CommunityPageNationData from "../CommunityHook/CommunityPageNationData.js";

export default function CommunityPostsPage(category){
    const { data: posts, fetchPosts, hasMore, isLoading, isError } = CommunityPageNationData(category.category);
    return (
        <>
                {isError && <ErrorMsg error={isError}/>}
                {isLoading && <Loading/>}
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
        </>
    )
}