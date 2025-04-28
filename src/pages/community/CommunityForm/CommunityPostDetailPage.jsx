
import {CreateComments, DeleteComment, DeletePost, GetComments, ReadPost} from "../CommunityUtil/CommunityFetch.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Loading from "../Loading.jsx";
import ErrorMsg from "../ErrorMsg.jsx";
import CommunityNavbar from "../CommunityNavbar.jsx";
import CommunityCreateCommentForm from "./CommunityCreateCommentForm.jsx";
import "../CommunityPost.css";
import {Button} from "react-bootstrap";

export default function CommunityPostDetailPage() {
    const {postNo}=useParams();
    // const [loginUserNo,setLoginUserNo] = useState(null);
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
    function DeletePostBtn({postNo,userNo,category}) {
        const navigate=useNavigate();

        let DeletePostHandler = async () => {
            if (!confirm('정말 게시글을 삭제하시겠습니까?')) {
                alert('게시글 삭제를 취소합니다.');
                return;
            }
            try {
                await DeletePost(postNo, userNo);
                alert('게시글이 삭제되었습니다.');
                navigate(`/community/${category}`);
            } catch (error) {
                alert(error + ' 오류로 인해 게시글 삭제에 실패했습니다.');
            }}
            return (
                <Button variant="danger" onClick={DeletePostHandler}>
                    삭제하기
                </Button>
            )
        }
        function DeleteCommentBtn({userNo,commentNo}) {
        const navigate=useNavigate();

        let DeletePostHandler = async () => {
            if (!confirm('정말 댓글을 삭제하시겠습니까?')) {
                alert('댓글 삭제를 취소합니다.');
                return;
            }
            try {
                await DeleteComment(commentNo, userNo);
                alert('댓글이 삭제되었습니다.');
                navigate(`/community/posts/${commentNo}`);
            } catch (error) {
                alert(error + ' 오류로 인해 게시글 삭제에 실패했습니다.');
            }}
            return (
                <Button variant="danger" onClick={DeletePostHandler}>
                    삭제하기
                </Button>
            )
        }
    return (
            <div className={"container"}>
                {isLoading && <h1><Loading/></h1>}
                {error && <h1><ErrorMsg error={error}/></h1>}
                <div className="CommunityPostDetail">
                    <CommunityNavbar/>
                    {post && post.map(post=>(
                            <div key={post.id}>
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
                                <div className={"Community-PostModify"} style={{display:Number(loginUserNo)===Number(post.userNo) ? "flex" : "none"}}>
                                    <span><DeletePostBtn postNo={post.id} userNo={loginUserNo} category={post.category}/></span>
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

                    ))}
                    {commentDto && commentDto.map(c => (
                        <div
                            key={c.id}
                            className="Community-comment"
                            style={{ display:c.parentNo ? "none" : "flex" }} // ✅ parentNo가 있으면 숨김
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
                                    <span><DeleteCommentBtn userNo={commentDto.userNo} commentNo={Number(commentDto.id)}/></span>
                                    <span><Button variant="primary" type={"button"}>수정하기</Button></span>
                                </div>
                                </div>
                            </div>
                            <h2>{c.commentCont}</h2>
                            <div>
                                <div className={"Community-CommentCont"}>
                                        <Button variant="secondary">대댓글 달기</Button>
                                        <div style={{display:c.replyCount === 0 ?  "flex" : "none",alignItems:"flex-end"}}>
                                        <Button variant="primary">&nbsp;좋아요</Button>&nbsp;{c.likeCount}&nbsp;
                                        <Button variant="danger">&nbsp;싫어요</Button>&nbsp;{c.dislikeCount}&nbsp;
                                        </div>
                                </div>
                                <div className={"Community-CommentCont"}>
                                <Button variant="primary" style={{display:c.replyCount === 0 ? "none" : "block"}} type="button">대댓글 {c.replyCount}개 보기</Button>
                                <div style={{display:c.replyCount === 0 ?  "none" : "flex",alignItems:"flex-end"}}>
                                    <Button variant="primary">&nbsp;좋아요</Button>&nbsp;{c.likeCount}&nbsp;
                                    <Button variant="danger">&nbsp;싫어요</Button>&nbsp;{c.dislikeCount}&nbsp;
                                </div>
                                </div>
                            </div>
                        </div>
                    ))}
                        </div>
            </div>)
    //post =>
        //comment =>
    }
