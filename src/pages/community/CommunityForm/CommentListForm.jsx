import {Link, useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";
import {CommentLikeComponent} from "../CommunityComponents/LikeCommentComponent.jsx";
import {useContext, useEffect, useMemo, useState} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {DeleteComment, GetComments} from "../CommunityUtil/CommunityCommentFetch.js";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import "../CommunityComponents/Community-Component.css"
import CommentForm from "./CommunityCommentTextManagement.jsx";
import {CommunityModal} from "../CommunityComponents/CommunityModal.jsx";

export default function CommentListForm(props) {
    const [loginUser, ] = useContext(UseLoginUserContext);
    const postNo = props.postNo;
    const [openReplyForm, setOpenReplyForm] = useState(null);
    const [editingComment, setEditingComment] = useState(null);

    const handleReplyClick = (commentNo) => {
        if(!loginUser){return null}
        setOpenReplyForm(prev => prev === commentNo ? null : commentNo);
    };

    const handleEditClick = (commentNo) => {
        if(!loginUser){return null}
        setEditingComment(prev => prev === commentNo ? null : commentNo);
    };
    const navigate=useNavigate();
    const [openReply, setOpenReply] = useState(null);
    const handleToggleReplies = (commentNo) => {
        setOpenReply(prev => prev === commentNo ? null : commentNo);
    };
    const [viewModal,setViewModal]=useState(false)
    const [modalMessage,setModalMessage]=useState("")
    const [modalTitle,setModalTitle]=useState("게시글 작성 오류!")
    const [deletePost,setDeletePost]=useState(false)
    const [modalFooter,setModalFooter]=useState(
        <button className={"Community-CloseBtn"} onClick={()=>{
        setViewModal(false)
    }}>닫기</button>)
    function DeleteCommentBtn({commentNo, postNo}) {
        const navigate = useNavigate();

        let DeletePostHandler = async () => {
            if (!loginUser) {
                setModalTitle("로그인 확인")
                setModalMessage("로그인 유저인지 확인되지 않았습니다. \n 다시 로그인을 해주세요.")
                setModalFooter( <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                    <button className={"Community-CloseBtn"} onClick={()=>{
                        setViewModal(false)}}>닫기</button>
                    <button className={"Community-ConfirmBtn"} onClick={()=> {
                        setViewModal(false)
                        navigate("/login")
                    }}>로그인 하기</button>
                </div>)
                setViewModal(true)
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
        staleTime: 18000,
        cacheTime: 1000 * 60 * 10,
        retry: 1,
    });

    return (
        <>
            <CommunityModal
            isOpen={viewModal}
            title={modalTitle}
            message={modalMessage}
            onClose={() => {
                setViewModal(false)
            }} // 모달 닫기가 자동으로 되도록
            footer={modalFooter}
        />
            {commentDto && commentDto.map((c) => {
                if (!c.parentNo) {
                    const isAuthor = loginUser?.id === c.userNo;
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
                                    {isAuthor && (
                                        <div style={{display: "flex", alignItems: "flex-end"}}>
                                            <DeleteCommentBtn commentNo={Number(c.id)} postNo={c.postNo}/>
                                            &nbsp;
                                            <Button variant="primary" onClick={() => handleEditClick(c.id)}>
                                                {editingComment === c.id ? "수정 취소" : "수정하기"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {editingComment === c.id && (
                                <CommentForm
                                    postNo={c.postNo}
                                    commentNo={c.id}
                                    initialContent={c.commentCont}
                                    onSuccess={() => {
                                        setModalTitle("게시글 수정 성공!")
                                        setModalMessage("수정이 완료되었습니다!")
                                        setViewModal(true)
                                        setEditingComment(null)
                                        setOpenReplyForm(null)
                                    }}
                                    category={"Modify"}
                                />
                            )}

                            <h2 className={"Community-commentCont"}>{c.commentCont}</h2>

                            <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                                <span className="Community-ButtonFlex">
                                    <Button variant="secondary" onClick={() => handleReplyClick(c.id)} disabled={!loginUser}>
                                        {openReplyForm === c.id ? "대댓글 작성 취소" : "대댓글 달기"}
                                    </Button>

                                    {c.replyCount > 0 && (
                                        <Button
                                            variant="primary"
                                            onClick={() => handleToggleReplies(c.id)}
                                        >
                                            {openReply === c.id ? "대댓글 숨기기" : `대댓글 ${c.replyCount}개 보기`}
                                        </Button>
                                    )}
                                </span>

                                <div style={{alignItems: "flex-end", display: "flex", margin: "0 0.2rem 0.2rem 0"}}>
                                    <CommentLikeComponent comment={c} postNo={postNo}/>
                                </div>
                            </div>

                            {openReplyForm === c.id && (
                                <CommentForm
                                    postNo={c.postNo}
                                    parentNo={c.id}
                                    onSuccess={() => {
                                        setModalTitle("댓글 작성 성공!")
                                        setModalMessage("대댓글 작성이 완료되었습니다!")
                                        setViewModal(true)
                                        setOpenReplyForm(null)
                                    }}
                                    category={"Child"}
                                />
                            )}
                            {/* 대댓글 영역 */}
                            {openReply === c.id && commentDto
                                .filter(reply => reply.parentNo === c.id)
                                .map(reply => {
                                    const isAuthor = loginUser?.id === reply.userNo;

                                    return (
                                        <div key={reply.id} className="Community-ChildComment">
                                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                                <div className="Community-UserInfo">
                                                    <Link to={`/users/profile/${reply.userNo}`} className="Community-PostLink">
                                                        <img src={"/images/user_icon_default.png"} alt="" className="Community-ProfileImg"/>
                                                        <div>
                                                            <span>{reply.userNickname}</span>
                                                            <span>Lv.{reply.userNo}</span>
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div style={{marginBottom: "3%"}}>
                                                    <span>{reply.commentCreatedAt}</span>
                                                    {isAuthor && (
                                                        <div style={{display: "flex", alignItems: "flex-end"}}>
                                                            <DeleteCommentBtn commentNo={Number(reply.id)} postNo={reply.postNo}/>
                                                            &nbsp;
                                                            <Button variant="primary">수정하기</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <h3 style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>{reply.commentCont}
                                                <CommentLikeComponent comment={reply} postNo={reply.postNo}/></h3>
                                        </div>
                                    );
                                })}
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </>
    );
}