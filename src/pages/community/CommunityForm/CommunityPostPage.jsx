import ErrorMsg from "./ErrorMsg.jsx";
import Loading from "./Loading.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import {Link} from "react-router-dom";
import "../CommunityPost.css";
import CommunityPageNationData from "../CommunityHook/CommunityPageNationData.js";
import {Button} from "react-bootstrap";

export default function CommunityPostsPage(category){
    const { data: posts, fetchPosts, hasMore, isLoading, isError } = CommunityPageNationData(category.category);
    return (
        <div>
                {isError && <ErrorMsg error={isError}/>}
                {isLoading && <Loading/>}
            <div style={{width:"100%", minWidth:"30rem",maxWidth:"100rem",display:"flex",flexDirection:"column"}}
            className={"infiniteScrolls"}>
            <InfiniteScroll
                dataLength= {posts.length}
                next={fetchPosts}
                hasMore={hasMore}
                loader={<Loading/>}
                style={{width: "100%", minWidth:"30rem",maxWidth:"100rem",display:"flex"}}
                className={"infiniteScrolls"}
                endMessage={<p style={{ textAlign: "center" }}><b>더 이상 게시글이 없습니다.</b></p>}
            >
                {posts && posts.map((post) => (
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
                            <Link to={`/community/posts/${post.id}`} className={"Community-PostLink"}>
                                <div className={"InfiniteScrolls"}>
                                    <h2 className={"Community-postForm"}>{post.postCont}</h2>
                                    <div className={"Community-postInfo"}>
                                        <div>{post.postCreatedAt}</div>
                                        <div>
                                    <span>
                                    <Button variant="primary">좋아요</Button> {post.likeCount}&nbsp;
                                    <Button variant="danger">싫어요</Button> {post.dislikeCount}&nbsp;
                                        <span>댓글 {post.commentCount}개</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div></div>
                ))}
            </InfiniteScroll>
            </div>
        </div>
    )
}