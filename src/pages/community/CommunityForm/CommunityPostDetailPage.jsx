
import {CreateComments, GetComments, ReadPost} from "../CommunityUtil/CommunityFetch.js";
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Loading from "../Loading.jsx";
import ErrorMsg from "../ErrorMsg.jsx";
import CommunityNavbar from "../CommunityNavbar.jsx";
import CommunityCreateCommentForm from "./CommunityCreateCommentForm.jsx";
import "../CommunityPost.css";
import {Button} from "react-bootstrap";
import {useState} from "react";

export default function CommunityPostDetailPage() {
    const {postNo}=useParams();
    // const [loginUserNo,setLoginUserNo] = useState(1);
    const loginUserNo=1;
    const {data:post,isLoading,error}=useQuery({
        queryKey:["post",postNo],
        queryFn:async ()=>ReadPost(postNo),
        staleTime:1000*60*5,
        cacheTime:1000*60*10,
        retry : 1,
    })
    const {data:commentDto}=useQuery(
        {
            queryKey:["commentDto",postNo],
            queryFn:async ()=>GetComments(postNo),
            staleTime:1000*60*5,
            cacheTime:1000*60*10,
            retry : 1,
        }
    )
        return (
            <div className={"container"}>
                {isLoading && <h1><Loading/></h1>}
                {error && <h1><ErrorMsg error={error}/></h1>}
                <div className="CommunityPostDetail" style={{marginTop:"2%"}}>
                    <CommunityNavbar/>
                    {post && post.map(post=>
                            <div>
                                <Link to={`/community/${post.category}`}>게시판으로 돌아가기</Link>
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
                                <div className={"Community-PostModify"} style={{display:loginUserNo===post.userNo ? "flex" : "none"}}>
                                    <span><Button variant="danger" type={"button"}>삭제하기</Button></span>
                                    <span><Button variant="primary" type={"button"}>수정하기</Button></span>
                                </div>
                                <div className={"Community-PostCont"}>
                                    <h1>{post.postCont}</h1>
                                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                                    <span>{post.postCreatedAt}</span>
                                    <div>
                                    <span>
                                    <Button variant="primary">좋아요</Button>&nbsp;{post.likeCount}&nbsp;
                                    <Button variant="danger">싫어요</Button>&nbsp;{post.dislikeCount}&nbsp;
                                        <span>댓글 {post.commentCount} 개</span>
                                            </span>
                                    </div>
                                    </div>
                                </div>
                                <CommunityCreateCommentForm postNo={post.id} userNo={loginUserNo}/>
                            </div>

                    )}
                    {commentDto && commentDto.map(c => (
                        <div
                            key={c.id}
                            className="Community-comment"
                            style={{ display:c.parentNo ? "none" : "block" }} // ✅ parentNo가 있으면 숨김
                        >
                            <div style={{display:"flex", flexDirection:"row",justifyContent:"space-between"}}>
                            <div className={"Community-UserInfo"}>
                            <Link to={"/users/profile/" + c.userNo} className={"Community-Link"}>
                                {/*<img src={c.userProfileImg ? c.userProfileImg : "/images/user_icon_default.png"} alt=""*/}
                                {/*     className={"Community-ProfileImg"}/>*/}
                                {/*저장소 활성화 된 다음 쓸 예정*/}
                                <img src={"/images/user_icon_default.png"} alt=""
                                     className={"Community-ProfileImg"}/>
                                <div>
                                    <span>{c.userNickname}</span>
                                    <span>Lv.{c.userNo}</span>
                                </div>
                            </Link>
                            </div>
                                <div style={{marginBottom:"3%"}}>
                                <span>{c.commentCreatedAt}</span>
                                <div style={{display:loginUserNo===c.userNo ? "flex" : "none",alignItems:"flex-end",justifyContent:"end"}}>
                                    <span><Button variant="danger" type={"button"}>삭제하기</Button></span>
                                    <span><Button variant="primary" type={"button"}>수정하기</Button></span>
                                </div>
                                </div>
                            </div>
                            <h2>{c.commentCont}</h2>
                            <div>
                                <div  className={"Community-CommentCont"}>
                                    <Button variant="primary" style={{display:c.replyCount === 0 ? "none" : "block"}} type="button">대댓글 {c.replyCount}개 보기</Button>
                                    <Button variant="secondary">대댓글 달기</Button>
                                    <span>
                                    <Button variant="primary">좋아요</Button>{c.likeCount}
                                        <Button variant="danger">싫어요</Button>{c.dislikeCount}
                                </span>
                                </div>
                            </div>
                        </div>
                    ))}
                        </div>
            </div>)
    //post =>
        //comment =>
    }
