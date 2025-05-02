import {DeletePost, ReadPost} from "../CommunityUtil/CommunityPostFetch.js";
import {DeleteComment, GetComments} from "../CommunityUtil/CommunityCommentFetch.js";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import Loading from "./Loading.jsx";
import ErrorMsg from "./ErrorMsg.jsx";
import CommunityNavbar from "../CommunityComponents/CommunityNavbar.jsx";
import CommunityCreateCommentForm from "./CommunityCreateCommentForm.jsx";
import "../CommunityPost.css";
import {Button} from "react-bootstrap";
import {useContext} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";

export default function CommunityPostDetailPage() {
    const {postNo} = useParams();
    const navigate = useNavigate();
    const loginUserNo = 1;
    const {data: post, isLoading, error} = useQuery({
        queryKey: ["post", postNo],
        queryFn: async () => ReadPost(postNo),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
    })

    const CommentsWithLikes = ({postNo, userNo}) => {
        // 댓글 데이터를 가져오는 useQuery
        userNo=1;
        const queryClient = useQueryClient();
        const {data: commentDto} = useQuery(
            ['commentDto', postNo],
            async () => {
                const response = await GetComments(postNo);
                return response.data;
            },
            {
                staleTime: 1000 * 60 * 5,
                cacheTime: 1000 * 60 * 10,
                retry: 1,
            }
        );

        // 댓글에 대한 좋아요 상태를 가져오기 위한 API 요청 (fetch로 병렬 요청)
        const {data: likeStatuses} = useQuery(
            ['likeStatuses', commentDto.map((comment) => comment.id)],
            async () => {
                const responses = await Promise.all(
                    commentDto.map((comment) =>
                        fetch(`/api/comments/${comment.id}?userNo=${userNo}`)
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error('서버 오류');
                                }
                                return response.json();
                            })
                            .then((data) => data) // 응답 데이터를 반환
                    )
                );
                return responses; // 모든 응답을 배열로 반환
            },
            {
                enabled: !!commentDto, // commentDto가 있을 때만 좋아요 상태를 요청
            }
        );

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

        function DeleteCommentBtn({commentNo, userNo, postNo}) {
            const navigate = useNavigate();

            let DeletePostHandler = async () => {
                if (!confirm('정말 댓글을 삭제하시겠습니까?')) {
                    alert('댓글 삭제를 취소합니다.');
                    return;
                }
                try {
                    await DeleteComment(commentNo, userNo);
                    navigate(`/community/posts/${postNo}`);
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

        const handleToggleLike = async (commentNo, newLikeType) => {
            await fetch(`/api/community/comments/${commentNo}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commentNo: commentNo,
                    userNo: userNo,
                    likeType: newLikeType, // 1 = 좋아요, 0 = 싫어요
                }),
            });
            // 좋아요 상태 새로고침
            queryClient.invalidateQueries(['likeStatuses']);
        };
        return (
            <div className={"AllPosts"}>
                {isLoading && <h1><Loading/></h1>}
                {error && <h1><ErrorMsg error={error}/></h1>}
                <div className="CommunityPostDetail">
                    <CommunityNavbar/>
                    {post && post.map(post => (
                        <div key={post.id} style={{maxWidth: "100rem", minWidth: "30rem", width: "95%"}}>
                            <Link to={`/community/${post.category}`}>게시판으로 돌아가기</Link>

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
                    const likeType = likeStatuses[index]?.likeType;
                    {commentDto && commentDto.map((c, index) => {
                        return (<div
                                key={c.id}
                                className="Community-comment"
                                style={{display: c.parentNo ? "none" : "flex"}} // ✅ parentNo가 있으면 숨김
                            >
                                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                                    <div className={"Community-UserInfo"}>
                                        <Link to={"/users/profile/" + c.userNo} className={"Community-PostLink"}>
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
                                    <div style={{marginBottom: "3%"}}>
                                        <span>{c.commentCreatedAt}</span>
                                        <div style={{
                                            display: loginUserNo === c.userNo ? "flex" : "none",
                                            alignItems: "flex-end",
                                            justifyContent: "end"
                                        }}>
                                            <span><DeleteCommentBtn userNo={c.userNo} commentNo={Number(c.id)}
                                                                    postNo={c.postNo}/></span>
                                            &nbsp;<span><Button variant="primary" type={"button"}>수정하기</Button></span>
                                        </div>
                                    </div>
                                </div>
                                <h2>{c.commentCont}</h2>
                                <div>
                                    <div className={"Community-commentCont"}>
                                        <Button variant="secondary">대댓글 달기</Button>
                                        <div style={{
                                            display: c.replyCount === 0 ? "flex" : "none",
                                            alignItems: "flex-end"
                                        }}>
                                            <Button variant={likeStatuses[index] === 1 ? 'primary' : 'outline-primary'}
                                                    onClick={() => handleToggleLike(c.id, 1)}>&nbsp;👍</Button>&nbsp;{c.likeCount}&nbsp;
                                            <Button
                                                variant={likeStatuses[index] === 0 ? 'danger' : 'outline-danger'}
                                                onClick={() => handleToggleLike(c.id, 0)}
                                            >👎
                                            </Button>{c.dislikeCount}
                                        </div>
                                        <div className={"Community-commentCont"}>
                                            <Button variant="primary"
                                                    style={{display: c.replyCount === 0 ? "none" : "block"}}
                                                    type="button">대댓글 {c.replyCount}개 보기</Button>
                                            <div style={{
                                                display: c.replyCount === 0 ? "none" : "flex",
                                                alignItems: "flex-end"
                                            }}>
                                                <Button variant={likeStatuses[index] === 1 ? 'primary' : 'outline-primary'}
                                                        onClick={() => handleToggleLike(c.id, 1)}>&nbsp;👍</Button>&nbsp;{c.likeCount}&nbsp;
                                                <Button
                                                    variant={likeStatuses[index] === 0 ? 'danger' : 'outline-danger'}
                                                    onClick={() => handleToggleLike(c.id, 0)}
                                                >👎
                                                </Button>{c.dislikeCount}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        )
                    })}
                </div>
            </div>)
    }
}