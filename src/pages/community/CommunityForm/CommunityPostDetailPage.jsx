import { GetPost} from "../CommunityUtil/CommunityPostFetch.js";
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Loading from "./Loading.jsx";
import ErrorMsg from "./ErrorMsg.jsx";
import CommunityNavbar from "../CommunityComponents/CommunityNavbar.jsx";
import CommunityCommentForm from "./CommunityCommentTextManagement.jsx";
import "./CommunityPostList.css";
import "../CommunityComponents/Component.css"
import {PostLikeComponent} from "../CommunityComponents/LikePostComponent.jsx";
import CommentListForm from "./CommentListForm.jsx";
import {useContext} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import {DeletePostBtn} from "../CommunityComponents/CommunityButtonComponent.jsx";

export default function CommunityPostDetailPage() {
    const {postNo} = useParams();
    const [loginUser,]=useContext(UseLoginUserContext)
    const loginUserNo=loginUser?.id;
    const {data: post, isLoading, error} = useQuery({
        queryKey: ["post", postNo],
        queryFn: async () => GetPost(postNo),
        staleTime: 30000,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
    })
    const categoryText={
        "free": "자유",
        "chart": "차트분석",
        "pnl": "손익인증",
        "expert": "전문가"
    }
    return (
            <div className={"Community-AllPosts"}>
                {isLoading && <h1><Loading/></h1>}
                {error && <h1><ErrorMsg error={error}/></h1>}
                <div className="Community-PostDetail">
                    <CommunityNavbar/>
                    {post && post.map(post => (
                        <div key={post.id} style={{maxWidth: "100rem", minWidth: "20rem", width: "95%",marginTop: "0.5rem"}}>
                            <Link to={`/community/${post.category}`} className={"Community-BackLink"}>
                               <img src="/images/LeftArrow.png" alt={""} width={"17.5rem"}
                                    height={"20rem"} style={{marginBottom:"2rem"}}/>{categoryText[post.category]}게시판으로 돌아가기
                            </Link>
                            <div className={"Community-PostModify"}>
                                <div className={"Community-UserInfo"}>
                                    <Link to={"/users/profile/" + post.userNo} className={"Community-PostLink"}>
                                        <img
                                            src={post.userProfileImgUrl ? post.userProfileImgUrl : "/images/user_icon_default.png"}
                                            alt=""
                                            className={"Community-ProfileImg"}/>
                                        <div>
                                            <span>{post.userNickname}</span>
                                            <span>Lv.{post.userNo}</span>
                                        </div>
                                    </Link>
                                </div>
                                    <DeletePostBtn postNo={post.id} userNo={post.userNo}/>
                            </div>
                            <div className={"Community-PostCont"}>
                                <h1 className={"Community-PostContent"}>{post.postCont}</h1>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "flex-end"
                                }}>
                                    <span>{post.postCreatedAt}</span>
                                    <div>
                                    <span>
                                    <PostLikeComponent loginUserNo={loginUserNo} post={post} disabled={!loginUser}/>&nbsp;
                                        댓글 {post.commentCount} 개
                                            </span>
                                    </div>
                                </div>
                            </div>
                            <CommunityCommentForm postNo={postNo} category={"Create"}/>
                            <br/>
                            <CommentListForm postNo={postNo}/>
                        </div>
                    ))}
                </div>
            </div>)
}