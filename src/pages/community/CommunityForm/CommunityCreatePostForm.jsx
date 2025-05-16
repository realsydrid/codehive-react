import {CreatePost} from "../CommunityUtil/CommunityPostFetch.js";
import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import "./CommunityTextArea.css";
import "./CommunityPostList.css";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import {useQueryClient} from "@tanstack/react-query";
import {CommunityModal} from "../CommunityComponents/CommunityModal.jsx";

export default function CommunityCreatePostForm({category}){
    const [postCont, setPostCont] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginUser,]=useContext(UseLoginUserContext)
    const queryClient = useQueryClient();
    const [viewModal,setViewModal]=useState(false)
    const [modalMessage,setModalMessage]=useState("")
    const [modalTitle,setModalTitle]=useState("게시글 작성 오류!")
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
             if(postCont === ""){
                 e.preventDefault()
                 setIsSubmitting(false);
                 setModalMessage("내용을 확인해주세요!")
                 setViewModal(true)
             }
            else{
                e.preventDefault()
                setPostCont("");
                await CreatePost(category,postCont);
                queryClient.invalidateQueries({queryKey: ['posts', category]});
                setModalTitle("게시글 등록 성공!")
                 setModalMessage("게시글이 성공적으로 등록되었습니다!")
                 setViewModal(true)}
        } catch (error) {
            setModalMessage(error.message+"오류 내용을 확인해주세요!")
            setViewModal(true)
            setIsSubmitting(false);
        } finally {
            setIsSubmitting(false);
            queryClient.invalidateQueries({queryKey: ['posts', category]});
        }
    };
    useEffect(() => {
    }, [modalMessage, modalTitle, viewModal]);
   if(loginUser!==null) return (
        <div style={{alignItems:"center"}}>
            <CommunityModal
                isOpen={viewModal}
                title={modalTitle}
                message={modalMessage}
                onClose={() => setViewModal(false)} // 모달 닫기 핸들러도 필요하다면
                footer={<button className={"Community-CloseBtn"} onClick={()=>{setViewModal(false)}}>닫기</button>}
            />
            <Form>
                <Form.Group controlId="postCont" className={"CreatePostForm"}>
                    <Form.Label column={"lg"} style={{display:"none",width:"100%",maxWidth:"100rem",minWidth:"20rem"}}>게시글 내용</Form.Label>
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
    if(loginUser==null)
        return (
            <div style={{margin:"2rem 0 1rem 0"}}>
                <h2 className={"Community-Return-Title"}>게시글을 작성하기 위해선<br/> 로그인 해야 합니다.</h2>
                <Link to={"/login"}>
                    <button className={"Community-Return-Button"}>로그인 화면으로 이동하기</button>
                </Link>
            </div>
        );
}