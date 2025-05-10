import {CreatePost} from "../CommunityUtil/CommunityPostFetch.js";
import {useContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import "../CommunityTextArea.css";
import "../CommunityPost.css";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import {useQueryClient} from "@tanstack/react-query";

export default function CommunityCreatePostForm({category}){
    const [loginUser,]=useContext(UseLoginUserContext)
    const [isLogin,setIsLogin]=useState(true);
    const loginUserNo=loginUser?.id;
    useEffect(() => {
        setIsLogin(false);
    },[loginUser])
    const navigate = useNavigate();
    const [postCont, setPostCont] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if(!loginUser){
            alert("로그인 해주세요!")
            setIsSubmitting(false);
            return;
        }
        try {
             if(postCont === ""){
                setIsSubmitting(false);
                alert("게시글을 입력해주세요!")
                e.preventDefault()
            }else if(loginUserNo===null){
                 alert("로그인 후 이용해주세요!")
                 e.preventDefault()
                 return navigate("/login")
             }
            else{
                setPostCont("");
                await CreatePost(category,postCont);
                alert("게시글이 성공적으로 등록되었습니다.");}
        } catch (error) {
            e.preventDefault();
            alert("게시글 등록 중 오류가 발생했습니다."+error.message);
            setIsSubmitting(false);
        } finally {
            e.preventDefault();
            setIsSubmitting(false);
            setIsLogin(false);
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
                    <Button variant="primary" type="button" disabled={isSubmitting || isLogin} onClick={handleSubmit}>
                        {/*{isSubmitting= }*/}1111
                    </Button>
                        </span>
                </div>
            </Form>
        </div>
    )
}