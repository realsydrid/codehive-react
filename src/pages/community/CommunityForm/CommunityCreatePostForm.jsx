import {CreatePost} from "../CommunityUtil/CommunityPostFetch.js";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import "./CommunityTextArea.css";
import "./CommunityPostList.css";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import {useQueryClient} from "@tanstack/react-query";

export default function CommunityCreatePostForm({category}){
    const [postCont, setPostCont] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
             if(postCont === ""){
                setIsSubmitting(false);
                alert("게시글을 입력해주세요!")
            }
            else{
                setPostCont("");
                await CreatePost(category,postCont);
                queryClient.invalidateQueries({queryKey: ['posts', category]});
                alert("게시글이 성공적으로 등록되었습니다.");}
        } catch (error) {
            alert("게시글 등록 중 오류가 발생했습니다."+error.message);
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
            queryClient.invalidateQueries({queryKey: ['posts', category]});
        }
    };
    return (
        <div>
            <Form>
                <Form.Group controlId="postCont" className={"CreatePostForm"}>
                    <Form.Label column={"lg"} style={{display:"none",width:"95%",maxWidth:"100rem",minWidth:"20rem"}}>게시글 내용</Form.Label>
                    <Form.Control
                        className="Community-EditPostContTextArea"
                        as="textarea"
                        name="postCont"
                        placeholder="이용정첵에 위배되는 글을 게시할 경우에는 제재가 될 수 있습니다."
                        value={postCont}
                        disabled={isSubmitting}
                        onChange={(e) => setPostCont(e.target.value)}
                    />
                </Form.Group>
                <div>
                    <span>
                    </span>
                    <span>
                    <Button variant="primary" type="button" disabled={isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? "게시중..." : "게시하기"}
                    </Button>
                        </span>
                </div>
            </Form>
        </div>
    )
}