import {CreateComments} from "../CommunityUtil/CommunityCommentFetch.js";
import {useContext, useState} from "react";
import {redirect, useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import "../CommunityTextArea.css";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";

export default function CommunityCreateCommentForm(post){
    const [commentCont, setCommentCont] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedPost=post.postNo;
    const userNo=post.userNo;
    const navigate = useNavigate();
    const  [loginUser, ]= useContext(UseLoginUserContext);
    const handleSubmit = async (e) => {
        if(!loginUser){
            alert("로그인 해주세요!")
            navigate("/login");
        }
        setIsSubmitting(true);
        if(commentCont === ""){
            setIsSubmitting(false);
            alert("내용을 입력해주세요!")
            e.preventDefault();
        }
        else{setCommentCont("");}
        alert("댓글이 성공적으로 등록되었습니다.");

        await CreateComments(selectedPost,userNo,commentCont);
        try {navigate(`http://localhost:5173/posts/detail?postNo=${selectedPost}`)}
        catch (error) {
            console.error("댓글 생성 실패:", error);
            alert("댓글 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commentCont">
            <Form.Label column={"lg"}>댓글 작성</Form.Label>
            <Form.Control
                as="textarea"
                name="commentCont"
                placeholder="안녕하세요! 자유롭게 이용하시되 이용정첵에 위배되거나 특정 사용자를 무분별한 비난하는 글을 게시할 경우에는 제재가 될 수 있습니다."
                className={"CreateComment"}
                value={commentCont}
                disabled={isSubmitting}
                onChange={(e) => setCommentCont(e.target.value)}
            />
        </Form.Group>

        <div className="d-flex justify-content-between mt-2">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "게시 중..." : "게시하기"}
            </Button>
        </div>
    </Form>

    )
}