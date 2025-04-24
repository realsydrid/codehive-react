import {CreateComments, CreatePosts} from "../CommunityUtil/CommunityFetch.js";
import {useState} from "react";
import {redirect} from "react-router-dom";
import {Button, Form, FormGroup} from "react-bootstrap";

export default function CommunityCreateCommentForm(postNo,userNo){
    const [commentCont, setCommentCont] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedPost=postNo.postNo;
    const userNum=postNo.userNo;
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(postNo)
        console.log(userNum)
        console.log(commentCont)
        // if (!postCont.trim()) return;
        setIsSubmitting(true);
        try {
            if(commentCont === ""){
                setIsSubmitting(false);
                alert("내용을 입력해주세요!")
                e.preventDefault()
            }
            else{
                await CreateComments(selectedPost,commentCont,userNo);
                alert("댓글이 성공적으로 등록되었습니다.");
                setCommentCont("");}
            redirect(`http://localhost:5173/posts/${selectedPost}`);
        } catch (error) {
            console.error("댓글 생성 실패:", error);
            alert("댓글 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <Form onSubmit={handleSubmit} style={{width:"100%", height:"250px",display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column",
        minWidth:"800px",maxWidth:"2500px",margin:"15px"}}>
        <Form.Group controlId="postCont">
            <Form.Label column={"lg"}>댓글 작성</Form.Label>
            <Form.Control
                as="textarea"
                name="commentCont"
                placeholder="안녕하세요! 자유롭게 이용하시되 이용정첵에 위배되거나 특정 사용자를 무분별한 비난하는 글을 게시할 경우에는 제재가 될 수 있습니다."
                style={{
                    width:"100%",
                    minWidth: "800px",
                    maxWidth: "2500px",
                    height: "150px",
                    resize: "none",
                    fontSize: "20px",
                }}
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