import {DeletePost, GetPost} from "../CommunityUtil/CommunityPostFetch.js";
import {DeleteComment, GetComments} from "../CommunityUtil/CommunityCommentFetch.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Loading from "./Loading.jsx";
import ErrorMsg from "./ErrorMsg.jsx";
import CommunityNavbar from "../CommunityComponents/CommunityNavbar.jsx";
import CommunityCommentForm from "./CommunityCommentTextManagement.jsx";
import "../CommunityPost.css";
import "../CommunityComponents/Component.css"
import {Button} from "react-bootstrap";
import {PostLikeComponent} from "../CommunityComponents/LikePostComponent.jsx";
import CommentComponent from "../CommunityComponents/CommentComponent.jsx";



export default function CommunityPostDetailPage() {
    const {postNo} = useParams();
    const navigate = useNavigate();
    // const [loginUser,]=useContext(UseLoginUserContext)
    // const loginUserNo=loginUser.id;
    const loginUserNo = 1; //임시 하드코딩
    const {data: post, isLoading, error} = useQuery({
        queryKey: ["post", postNo],
        queryFn: async () => GetPost(postNo),
        staleTime: 0,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
    })

        function DeletePostBtn({postNo, category}) {
            let DeletePostHandler = async () => {
                if (!loginUserNo) {
                    alert("로그인 해주세요!")
                    return navigate("/login")
                }
                // else if(userNo!==loginUserNo){
                //     alert("삭제할 권한이 없습니다!");
                //     return;
                // }
                if (!confirm('정말 게시글을 삭제하시겠습니까?')) {
                    alert('게시글 삭제를 취소합니다.');
                    return;
                }
                try {
                    await DeletePost(postNo);
                    alert('게시글이 삭제되었습니다.');
                    navigate(`/community/${category}`);
                } catch (error) {
                    alert(error + ' 오류로 인해 게시글 삭제에 실패했습니다.');
                }
            }
            return (
                <Button variant="danger" onClick={DeletePostHandler}>
                    삭제하기
                </Button>
            )
        }
    const categoryText={
        "free": "자유",
        "chart": "차트분석",
        "pnl": "손익인증",
        "expert": "전문가"
    }
        return (
            <div className={"AllPosts"}>
                {isLoading && <h1><Loading/></h1>}
                {error && <h1><ErrorMsg error={error}/></h1>}
                <div className="CommunityPostDetail">
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
                                <span style={{
                                    paddingTop: "2rem",
                                    display: Number(loginUserNo) === Number(post.userNo) ? "flex" : "none"
                                }}>
                                        <DeletePostBtn postNo={post.id} userNo={loginUserNo}
                                                       category={post.category}/>&nbsp;
                                    <Link to={`/community/posts/${post.id}/modify`}><Button variant="primary"
                                                                                            type={"button"}>수정하기</Button></Link>
                                    </span>
                            </div>
                            <div className={"Community-PostCont"}>
                                <h1>{post.postCont}</h1>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start"
                                }}>
                                    <span>{post.postCreatedAt}</span>
                                    <div>
                                    <span>
                                    <PostLikeComponent loginUserNo={loginUserNo} post={post}/>&nbsp;
                                        댓글 {post.commentCount} 개
                                            </span>
                                    </div>
                                </div>
                            </div>
                            <CommunityCommentForm postNo={postNo} userNo={loginUserNo} category={"Create"}/>
                            <br/>
                            <CommentComponent postNo={postNo}/>
                        </div>
                    ))}
                </div>
            </div>)
}