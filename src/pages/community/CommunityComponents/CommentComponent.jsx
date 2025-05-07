import {Link, useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {CommentLikeComponent} from "./LikeCommentComponent.jsx";
import {useContext, useEffect, useMemo, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {DeleteComment, GetComments} from "../CommunityUtil/CommunityCommentFetch.js";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import "./Component.css"
import CommentForm from "../CommunityForm/CommunityCommentTextManagement.jsx";

export default function CommentComponent(props) {
    const [loginUser, ] = useContext(UseLoginUserContext);
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (loginUser !== null) {
            setIsLoadingUser(false);
        }
    }, [loginUser]);

    const loginUserNo = loginUser?.id;
    const postNo = props.postNo;
    const [openReplyForm, setOpenReplyForm] = useState(null);
    const [editingComment, setEditingComment] = useState(null);

    const handleReplyClick = (commentNo) => {
        setOpenReplyForm(prev => prev === commentNo ? null : commentNo);
    };

    const handleEditClick = (commentNo) => {
        setEditingComment(prev => prev === commentNo ? null : commentNo);
    };

    const [openReply, setOpenReply] = useState(null);
    const handleToggleReplies = (commentNo) => {
        setOpenReply(prev => prev === commentNo ? null : commentNo);
    };

    function DeleteCommentBtn({commentNo, postNo}) {
        const navigate = useNavigate();

        let DeletePostHandler = async () => {
            if (!loginUserNo) {
                alert("적절한 권한이 없습니다. 로그인을 해주세요!");
                return navigate("/login");
            }
            if (!confirm('정말 댓글을 삭제하시겠습니까?')) {
                alert('댓글 삭제를 취소합니다.');
                return;
            }
            try {
                await DeleteComment(commentNo);
                navigate(`/community/posts/${postNo}`);
            } catch (error) {
                alert(error + ' 오류로 인해 댓글 삭제에 실패했습니다.');
            }
        };

        return (
            <Button variant="danger" onClick={DeletePostHandler}>
                삭제하기
            </Button>
        );
    }

    const {data: commentDto} = useQuery({
        queryKey: ["commentDto", postNo],
        queryFn: async () => await GetComments(postNo),
        staleTime: 0,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
    });

    // ✅ 댓글 + 유저 상태 병합
    const mergedComments = useMemo(() => {
        if (!commentDto) return [];
        return commentDto.map((comment) => {
            const cachedStatus = queryClient.getQueryData(["commentLikeStatus", loginUserNo, comment.id]);
            return {
                ...comment,
                userLikeType: comment.userLikeType ?? cachedStatus?.likeType ?? null,
            };
        });
    }, [commentDto, loginUserNo, queryClient]);

    return (
        <>
            {mergedComments && mergedComments.map((c) => {
                if (!c.parentNo) {
                    return (
                        <div key={c.id} className="Community-comment">
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <div className="Community-UserInfo">
                                    <Link to={`/users/profile/${c.userNo}`} className="Community-PostLink">
                                        <img src={"/images/user_icon_default.png"} alt="" className="Community-ProfileImg"/>
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
                                        alignItems: "flex-end"
                                    }}>
                                        <DeleteCommentBtn commentNo={Number(c.id)} postNo={c.postNo}/>
                                        &nbsp;<Button variant="primary" onClick={() => handleEditClick(c.id)}
                                                      disabled={isLoadingUser}>
                                        {editingComment === c.id ? "수정 취소" : "수정하기"}
                                    </Button>
                                    </div>
                                </div>
                            </div>
                            {editingComment === c.id && (
                                <CommentForm
                                    postNo={c.postNo}
                                    userNo={loginUserNo}
                                    commentNo={c.id}
                                    initialContent={c.commentCont}
                                    onSuccess={() => {
                                        setEditingComment(null);
                                    }}
                                    category={"Modify"}
                                />
                            )}
                            <h2 className={"Community-commentCont"}>{c.commentCont}</h2>
                            <div
                                style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                                <span className="Community-ButtonFlex">
                                    <Button variant="secondary" onClick={() => handleReplyClick(c.id)}
                                            disabled={isLoadingUser}>
                                        {openReplyForm === c.id ? "대댓글 작성 취소" : "대댓글 달기"}
                                    </Button>

                                    <Button
                                        variant="primary"
                                        style={{display: c.replyCount === 0 ? "none" : "block"}}
                                        onClick={() => handleToggleReplies(c.id)}
                                    >
                                        {openReply === c.id ? "대댓글 숨기기" : `대댓글 ${c.replyCount}개 보기`}
                                    </Button>
                                </span>
                                <div style={{alignItems: "flex-end", display: "flex", margin: "0 0.2rem 0.2rem 0"}}>
                                    <CommentLikeComponent comment={c} loginUserNo={loginUserNo}/>
                                </div>
                            </div>
                            {openReplyForm === c.id && (
                                <CommentForm
                                    postNo={c.postNo}
                                    parentNo={c.id}
                                    userNo={loginUserNo}
                                    onSuccess={() => {
                                        setOpenReplyForm(null);
                                    }}
                                    category={"Child"}
                                />
                            )}

                            {/* 대댓글 영역 */}
                            {openReply === c.id && mergedComments
                                .filter(reply => reply.parentNo === c.id)
                                .map(reply => (
                                    <div
                                        key={reply.id}
                                        className="Community-ChildComment"
                                    >
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div className="Community-UserInfo">
                                                <Link to={`/users/profile/${reply.userNo}`}
                                                      className="Community-PostLink">
                                                    <img src={"/images/user_icon_default.png"} alt=""
                                                         className="Community-ProfileImg"/>
                                                    <div>
                                                        <span>{reply.userNickname}</span>
                                                        <span>Lv.{reply.userNo}</span>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div style={{marginBottom: "3%"}}>
                                                <span>{reply.commentCreatedAt}</span>
                                                <div style={{
                                                    display: loginUserNo === reply.userNo ? "flex" : "none",
                                                    alignItems: "flex-end"
                                                }}>
                                                    <DeleteCommentBtn commentNo={Number(reply.id)}
                                                                      postNo={reply.postNo}/>
                                                    &nbsp;<Button variant="primary">수정하기</Button>
                                                </div>
                                            </div>
                                        </div>
                                        <h3>{reply.commentCont}</h3>
                                        <CommentLikeComponent comment={reply} loginUserNo={loginUserNo}
                                                              disabled={isLoadingUser}/>
                                    </div>
                                ))}
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </>
    );
}