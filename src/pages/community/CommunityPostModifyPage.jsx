import CommunityModifyPostForm from "./CommunityForm/modifyPostForm.jsx";
import {useEffect, useState} from "react";
import {ModifyPost, GetPost} from "./CommunityUtil/CommunityPostFetch.js";
import Loading from "./CommunityForm/Loading.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {CommunityModal} from "./CommunityComponents/CommunityModal.jsx";
import {useQueryClient} from "@tanstack/react-query";
import {Button, Form} from "react-bootstrap";

export default function CommunityPostModifyPage(){
    const {postNo}=useParams();
    const [post, setPost] = useState("");
    const [postCont,setPostCont]=useState("")
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const queryClient = useQueryClient();
    const [viewModal,setViewModal]=useState(false)
    const [modalMessage,setModalMessage]=useState("")
    const [modalTitle,setModalTitle]=useState("")
    const [modalFooter,setModalFooter]=useState(
        <button className={"Community-CloseBtn"} onClick={()=>handleSubmit}>수정하기</button>
    )
    useEffect(()=>{
        if(!postNo){return;}
        const BeforePost = async () => {
            const res = await GetPost(postNo); // res = { 0: {...} }
            const values = Object.values(res);
            const postData = values[0];
            setPost(postData);
            setIsLoading(false);
        };
        BeforePost();
    },[postNo])
    if(isLoading){return <Loading/>}
    if(!post){
        setModalTitle("게시글 존재 여부")
        setModalMessage("게시글이 존재하지 않아 \n 게시글 홈페이지로 이동합니다.")
        setModalFooter(<button className={"Community-CloseBtn"} onClick={()=>navigate(`/community/free`)}>돌아가기`</button>)
        setViewModal(true)
        return navigate("/community/free")
    }
        const handleSubmit = ()=>{
            setIsSubmitting(true);
            if(!postCont || postCont==="") {
                setViewModal(false)
                setModalTitle("게시글 수정 현황")
                setModalMessage("내용이 없어 수정할 수 없습니다!")
                setModalFooter(<button className={"Community-CloseBtn"} onClick={()=>{
                    setViewModal(false)}}>돌아가기</button>)
                setViewModal(true)
                setIsSubmitting(false)
            }
            else{ModifyPost(postNo,postCont).then(
                setIsLoading(false),
                setModalTitle("게시글 수정상태 확인"),
                setModalMessage("게시글을 성공적으로 수정하였습니다! \n 버튼을 누르시거나 자동으로 3초 뒤에 \n 원래 게시물로 이동합니다."),
                setModalFooter(<button className={"Community-CloseBtn"} onClick={()=>{
                    setViewModal(false)
                    navigate(`/community/posts/${post.id}`)
                }}>돌아가기</button>),
                setViewModal(true),
                queryClient.invalidateQueries(["post", Number(post.id)]),
                setTimeout(()=> navigate(`/community/posts/${post.id}`),3000))
            }
        }
    return (
        <div>
            <CommunityModal
                isOpen={viewModal}
                title={modalTitle}
                message={modalMessage}
                onClose={() => {
                    setViewModal(false)
                }} // 모달 닫기 핸들러도 필요하다면
                footer={modalFooter}
            />
            <Form>
                <Form.Group controlId="postCont">
                    <Form.Label column={"lg"}>게시글 수정</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="postCont"
                        placeholder={post.postCont}
                        className={"Community-EditPostContTextArea"}
                        defaultValue={post.postCont}
                        onChange={(e)=>setPostCont(e.target.value)}
                        disabled={isSubmitting}
                    />
                </Form.Group>
                <hr/>
                <div className="d-flex justify-content-between mt-2">
                    <Button variant="primary" type="button" disabled={isSubmitting} onClick={handleSubmit}>
                        {isSubmitting ? "게시 중..." : "게시하기"}
                    </Button>
                </div>
            </Form>
        </div>
    )
}