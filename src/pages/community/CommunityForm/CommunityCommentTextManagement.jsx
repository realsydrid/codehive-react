import {CreateComments, ModifyComment} from "../CommunityUtil/CommunityCommentFetch.js";
import {useContext, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import "./CommunityTextArea.css";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import "/src/pages/community/CommunityComponents/Community-Component.css"
import {useQueryClient} from "@tanstack/react-query";
import {CommunityModal} from "../CommunityComponents/CommunityModal.jsx";

function CommunityEditTitle({category}) {
    const categoryMsg={
        "Create": "댓글 작성",
        "Modify": "댓글 수정",
        "Child": "대댓글 작성",
    }
    return (
        <>{categoryMsg[category]}</>
    )
}
export default function CommentForm
    ({
         postNo,           //해당 게시물에 해당하는 댓글인지를 알기 위함
        parentNo = null, //null이 아닐때는 대댓글 수정
        commentNo = null, // 댓글 id(=commentNo)가 있으면 수정 모드
        initialContent = "", // 수정 시 초기값
        category                  //제목 지정
    }) {
    const queryClient = useQueryClient();
    const [loginUser,]=useContext(UseLoginUserContext)
    const [commentCont, setCommentCont] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [viewModal,setViewModal]=useState(false)
    const [modalMessage,setModalMessage]=useState("")
    const [modalTitle,setModalTitle]=useState("게시글 작성 상황")
    const handleSubmit = async () => {
        if (!loginUser) {
            setModalTitle("로그인 유저 없음")
            setModalMessage("로그인 하시겠습니까?")
            setViewModal(true)
        }
        if (commentCont.trim() === "") {
            setModalMessage("작성한 내용이 없습니다! \n 작성하려면 내용을 입력해주세요!")
            setViewModal(true)
        }
        if (commentCont === initialContent) {
            setModalMessage("수정된 내용이 없습니다!\n다시 확인해주세요!")
            setViewModal(true)
        }
        setIsSubmitting(true);
        try {
            if (commentNo) {
                // 댓글 번호가 있다면 수정.
                await ModifyComment({commentNo,commentCont});
            } else {
                // 댓글 번호가 없을시 게시글 작성, parentNo는 nullable 이므로 null 이면 댓글, not null 이면 대댓글
                setCommentCont("");
                if(parentNo===null){
                await CreateComments(postNo, commentCont, parentNo);
                setModalMessage("댓글이 등록되었습니다!")
                setViewModal(true)}
                else await CreateComments(postNo, commentCont, parentNo);
            }
        } catch (error) {
            error.message
            setViewModal(true)
        } finally {
            queryClient.invalidateQueries(["post", postNo])
            queryClient.invalidateQueries(["commentDto", postNo])
            setIsSubmitting(false);
            navigate(`/community/posts/${postNo}`)
        }
    };
    useEffect(() => {
    }, [modalMessage, modalTitle, viewModal]);
  if(loginUser!==null)  return (
      <div>
          <CommunityModal
              isOpen={viewModal}
              title={modalTitle}
              message={modalMessage}
              onClose={() => {
                  setViewModal(false)
              }} // 모달 닫기가 자동으로 되도록
              footer={
              loginUser ?  <button className={"Community-CloseBtn"} onClick={()=>{
                      setViewModal(false)
              }}>닫기</button>
                  :
                  <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                      <button className={"Community-CloseBtn"} onClick={()=>{
                          setViewModal(false)}}>닫기</button>
                      <button className={"Community-ConfirmBtn"} onClick={()=> {
                          navigate("/login")
                      }}>로그인 하기</button>
                  </div>
              }
          />
        <Form>
            <Form.Group controlId="commentCont">
                <Form.Label column={"lg"} style={{textAlign:"center",alignItems:"center"}}><CommunityEditTitle category={category}/></Form.Label>
                <Form.Control
                    as="textarea"
                    value={commentCont}
                    placeholder="내용을 입력해주세요."
                    onChange={(e) => setCommentCont(e.target.value)}
                    className="CreateComment"
                    disabled={isSubmitting}
                />
            </Form.Group>

            <div className="d-flex justify-content-end mt-2">
                <Button variant="primary" type="submit" disabled={isSubmitting} onClick={handleSubmit}>
                    {isSubmitting ? "작성 중..." : "작성하기"}
                </Button>
            </div>
        </Form>
      </div>
    );
  if(loginUser==null)
      return (
          <div style={{margin:"2rem 0 1rem 0"}}>
            <h1 className={"Community-Return-Title"}>댓글을 작성하기 위해선<br/> 로그인 해야 합니다.</h1>
              <Link to={"/login"}>
                  <button className={"Community-Return-Button"}>로그인 화면으로 이동하기</button>
              </Link>
          </div>
      );
}