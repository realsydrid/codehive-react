import { ModifyComment} from "../CommunityUtil/CommunityCommentFetch.js";
import {useState} from "react";;
import {Button, Form} from "react-bootstrap";
import "../CommunityTextArea.css";

export default function CommunityModifyCommentForm(comment){
    const [commentCont, setCommentCont] = useState(commentCont);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedComment=comment.commentNo;
    const userNo=comment.userNo;
    console.log(comment);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(comment.postNo)
        console.log(commentCont)
        // if (!postCont.trim()) return;
        setIsSubmitting(true);
        if(commentCont === comment.commentCont){
            setIsSubmitting(false);
            alert("수정된 내용이 없습니다!")
            e.preventDefault()
        }
        else{
            setCommentCont(comment.commentCont);}
        alert("댓글이 성공적으로 수정되었습니다.");
        try {
            await ModifyComment(selectedComment,userNo,commentCont);
        } catch (error) {
            console.error("댓글 수정 실패:", error);
            alert("댓글 수정 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="commentCont">
                <Form.Label column={"lg"}>댓글 수정</Form.Label>
                <Form.Control
                    as="textarea"
                    name="commentCont"
                    placeholder="안녕하세요! 자유롭게 이용하시되 이용정첵에 위배되거나 특정 사용자를 무분별한 비난하는 글을 게시할 경우에는 제재가 될 수 있습니다."
                    className={"CreateComment"}
                    value={comment.commentCont}
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