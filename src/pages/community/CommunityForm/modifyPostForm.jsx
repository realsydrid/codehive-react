import { ModifyComment} from "../CommunityUtil/CommunityCommentFetch.js";
import {useState} from "react";
import {Button, Form} from "react-bootstrap";
import "./CommunityTextArea.css";
import "/src/pages/community/CommunityComponents/Component.css"
import {Link, useNavigate} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";

export default function CommunityModifyPostForm({post,onSubmit}){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const postCont = formData.get("postCont");
        onSubmit(postCont);
        setIsSubmitting(true);
        alert("성공적으로 수정했습니다!")
        queryClient.invalidateQueries(["post", post.id])
        return navigate(`/community/posts/${post.id}`)
        }
   return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="postCont">
                <Form.Label column={"lg"}>게시글 수정</Form.Label>
                <Form.Control
                    as="textarea"
                    name="postCont"
                    placeholder={post.postCont}
                    className={"Community-EditPostContTextArea"}
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