import { ModifyComment} from "../CommunityUtil/CommunityCommentFetch.js";
import {useState} from "react";;
import {Button, Form} from "react-bootstrap";
import "../CommunityTextArea.css";
import {ModifyPost} from "../CommunityUtil/CommunityPostFetch.js";
import {useNavigate} from "react-router-dom";

export default function CommunityModifyPostForm({post,onSubmit}){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        const formData = new FormData(e.target);
        const postCont = formData.get("postCont");
        onSubmit(postCont);
        setIsSubmitting(true);
        alert("성공적으로 수정했습니다!")
        navigate(`/community/posts/${post.id}`);
        }
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="postCont">
                <Form.Label column={"lg"}>게시글 수정</Form.Label>
                <Form.Control
                    as="textarea"
                    name="postCont"
                    placeholder={post.postCont}
                    style={{width:"95%",minWidth:"30rem",maxWidth:"100rem",resize:"none", minHeight: "20rem",marginBottom:"2px"}}
                    defaultValue={post.postCont}
                    disabled={isSubmitting}
                />
            </Form.Group>
            <hr/>
            <div className="d-flex justify-content-between mt-2">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "게시 중..." : "게시하기"}
                </Button>
            </div>
        </Form>

    )
}