import {CreateComments, ModifyComment} from "../CommunityUtil/CommunityCommentFetch.js";
import {useContext, useState} from "react";
import {Link, redirect, useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import "../CommunityTextArea.css";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import CommunityTitle from "./CommunityTitle.jsx";
import * as PropTypes from "prop-types";

function CommunityEditTitle({category}) {
    const categoryMsg={
        "Create": "댓글 작성",
        "Modify": "댓글 수정",
        "Child": "대댓글 작성",
    }
    return (
        <>{categoryMsg[category]}</>
    )
}
export default function CommentForm
    ({
        postNo,           //해당 게시물에 해당하는 댓글인지를 알기 위함
        parentNo = null, //null이 아닐때는 대댓글 수정
        commentNo = null, // 댓글 id(=commentNo)가 있으면 수정 모드
        initialContent = "", // 수정 시 초기값
        category                  //제목 지정
    }) {
    const [loginUser,]=useContext(UseLoginUserContext);
    const loginUserNo=loginUser?.id
    const [commentCont, setCommentCont] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (!loginUserNo) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (commentCont.trim() === "") {
            alert("내용을 입력해주세요!");
            return;
        }

        setIsSubmitting(true);
        try {
            if (commentNo) {
                // 댓글 번호가 있다면 수정
                await ModifyComment({commentNo,commentCont});
                console.log(commentCont);
                alert("댓글이 수정되었습니다.");
                navigate(`/community/posts/${postNo}`);
            } else {
                // 댓글 번호가 없을시 게시글 작성, parentNo는 nullable 이므로 null 이면 댓글, not null 이면 대댓글
                await CreateComments(postNo, commentCont, parentNo);
                alert("댓글이 등록되었습니다.");
            }
            setCommentCont("");
            navigate(`/community/posts/${postNo}`); // 성공시 해당게시물로 새로고침
        } catch (error) {
            console.error("댓글 처리 실패:", error);
            alert("오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="commentCont">
                <Form.Label column={"lg"} style={{textAlign:"center",alignItems:"center"}}><CommunityEditTitle category={category}/></Form.Label>
                <Form.Control
                    as="textarea"
                    value={commentCont}
                    placeholder="내용을 입력해주세요."
                    onChange={(e) => setCommentCont(e.target.value)}
                    className="CreateComment"
                    disabled={isSubmitting}
                />
            </Form.Group>

            <div className="d-flex justify-content-end mt-2">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "작성 중..." : "작성하기"}
                </Button>
            </div>
        </Form>
    );
}