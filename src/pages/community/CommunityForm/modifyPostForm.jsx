import { ModifyComment} from "../CommunityUtil/CommunityCommentFetch.js";
import {useState} from "react";
import {Button, Form} from "react-bootstrap";
import "./CommunityTextArea.css";
import "/src/pages/community/CommunityComponents/Community-Component.css"
import {Link, useNavigate} from "react-router-dom";
import {useQueryClient} from "@tanstack/react-query";
import {CommunityModal} from "../CommunityComponents/CommunityModal.jsx";

export default function CommunityModifyPostForm({post,onSubmit}){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [viewModal,setViewModal]=useState(false)
    const [modalMessage,setModalMessage]=useState("게시글을 수정하시겠습니까?")
    const [modalTitle,setModalTitle]=useState("게시글 수정확인")
    const [modalFooter,setModalFooter]=useState(
        <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
        <span><button className={"Community-CloseBtn"} type={"button"} onClick={()=>{
            setViewModal(false)}}>취소 하기</button></span>
        <span><button className={"Community-ConfirmBtn"} type={"button"} onClick={()=>
            handleSubmit
        }>수정하기</button></span>
    </div>)
    const handleSubmit = (e) => {
        setIsSubmitting(true);
        try{
            setViewModal(false)
            const formData = new FormData(e.target);
            const postCont = formData.get("postCont");
            onSubmit(postCont);
        queryClient.invalidateQueries(["post", Number(post.id)])
        setModalTitle("게시글 수정상태 확인")
        setModalMessage("게시글을 성공적으로 수정하였습니다!")
        setViewModal(true)
        setModalFooter(<button className={"Community-CloseBtn"} onClick={()=>{
            setViewModal(false)
            navigate(`/community/posts/${post.id}`)
        }}>닫기</button>)
        return navigate(`/community/posts/${post.id}`)
        }catch (error) {
           setModalTitle("게시글 수정 오류발생")
           setModalMessage(error+"\n 오류가 발생하여 \n 수정에 실패하였습니다.")
            setModalFooter(<button className={"Community-CloseBtn"} onClick={()=>{
                setViewModal(false)
            }}>닫기</button>)
           setViewModal(true)
           setIsSubmitting(false)
       }}
   return (
       <div>
           <CommunityModal
               isOpen={viewModal}
               title={modalTitle}
               message={modalMessage}
               onClose={() => {
                   setViewModal(false)
               }} // 모달 닫기가 버튼으로 되도록
               footer={modalFooter}
           />
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
                <Button variant="primary" type="button" disabled={isSubmitting} onClick={()=>setViewModal(true)}>
                    {isSubmitting ? "게시 중..." : "게시하기"}
                </Button>
            </div>
        </Form>
       </div>
    )
}