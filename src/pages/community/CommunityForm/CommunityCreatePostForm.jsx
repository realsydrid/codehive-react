import {CreatePosts} from "../CommunityUtil/CommunityPostFetch.js";
import {useContext, useState} from "react";
import {redirect, useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import "../CommunityTextArea.css";
import "../CommunityPost.css";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";

export default function CommunityCreatePostForm(category){
    const navigate = useNavigate();
    const [postCont, setPostCont] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedCategory=category.category;
    const userNo=category.userNo;
    const handleSubmit = async (e) => {
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
        <div className={"AllPosts"}>
            <Form onSubmit={handleSubmit} className={"AllPosts"}>
                <Form.Group controlId="postCont"  className={"AllPosts"}>
                    <Form.Label column={"lg"} style={{display:"none",width:"95%",maxWidth:"100rem",minWidth:"30rem"}}>게시글 내용</Form.Label>
                    <Form.Control
                        style={{width:"95%",minWidth:"30rem",maxWidth:"100rem",resize:"none", minHeight: "20rem",marginBottom:"2px"}}
                        as="textarea"
                        name="postCont"
                        placeholder="안녕하세요! 자유롭게 이용하시되 이용정첵에 위배되는 글을 게시할 경우에는 제재가 될 수 있습니다."
                        value={postCont}
                        disabled={isSubmitting}
                        onChange={(e) => setPostCont(e.target.value)}
                    />
                </Form.Group>
                <div>
                    <span>
                    </span>
                    <span>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "게시 중..." : "게시하기"}
                    </Button>
                        </span>
                </div>
            </Form>
        </div>
    )
}