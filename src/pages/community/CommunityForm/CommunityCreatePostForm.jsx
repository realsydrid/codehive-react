import {CreatePosts} from "../CommunityUtil/CommunityFetch.js";
import {useState} from "react";
import {redirect} from "react-router-dom";
import {Button, Form, FormGroup, Stack} from "react-bootstrap";

export default function CommunityCreatePostForm(category){
    const [postCont, setPostCont] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedCategory=category.category;
    const userNo=category.userNo;
    const handleSubmit = async (e) => {
        // if (!postCont.trim()) return;
        setIsSubmitting(true);
        try {
            if(postCont === ""){
                setIsSubmitting(false);
                alert("게시글을 입력해주세요!")
                e.preventDefault()
            }
            else{
                await CreatePosts(selectedCategory,postCont,userNo);
            alert("게시글이 성공적으로 등록되었습니다.");
            setPostCont("");}
            redirect(`http://localhost:5173/community/${selectedCategory}`);
        } catch (error) {
            console.error("게시글 생성 실패:", error);
            alert("게시글 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <Form onSubmit={handleSubmit} style={{ width: "100%", minWidth: "800px", maxWidth: "1500px", margin: "0 auto" }}>
                <Form.Group controlId="postCont">
                    <Form.Label column={"lg"} style={{display:"none"}}>게시글 내용</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="postCont"
                        placeholder="안녕하세요! 자유롭게 이용하시되 이용정첵에 위배되는 글을 게시할 경우에는 제재가 될 수 있습니다."
                        style={{
                            minWidth: "800px",
                            maxWidth: "1500px",
                            height: "400px",
                            resize: "none",
                            fontSize: "20px",
                        }}
                        value={postCont}
                        disabled={isSubmitting}
                        onChange={(e) => setPostCont(e.target.value)}
                    />
                </Form.Group>

                <div className="d-flex justify-content-sm-between mt-3">
                    <span>
                    <Button variant="secondary" type="button" disabled={isSubmitting}>
                        이미지 첨부
                    </Button>
                    </span>
                    <span>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "게시 중..." : "게시하기"}
                    </Button>
                        </span>
                </div>
            </Form>
        </>
    )
}