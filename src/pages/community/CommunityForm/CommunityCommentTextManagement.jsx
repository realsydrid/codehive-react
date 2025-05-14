import {CreateComments, ModifyComment} from "../CommunityUtil/CommunityCommentFetch.js";
import {useContext, useState} from "react";
import {Link, redirect, useNavigate} from "react-router-dom";
import {Button, Form} from "react-bootstrap";
import "./CommunityTextArea.css";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import CommunityTitle from "../CommunityComponents/CommunityTitle.jsx";
import * as PropTypes from "prop-types";
import {useQueryClient} from "@tanstack/react-query";

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
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!loginUser) {
            if(confirm("로그인이 필요합니다! 로그인 하시겠습니까?")){
                queryClient.invalidateQueries(["commentDto", postNo])
                queryClient.invalidateQueries(["post", postNo])
                return navigate("/login")
            }
        }
        if (commentCont.trim() === "") {
            e.preventDefault();
            alert("내용을 입력해주세요!");
        }
        if (commentCont.trim() === initialContent) {
            e.preventDefault();
            alert("수정된 내용이 없습니다!");
        }
        setIsSubmitting(true);
        try {
            if (commentNo) {
                // 댓글 번호가 있다면 수정.
                await ModifyComment({commentNo,commentCont});
                queryClient.invalidateQueries(["commentDto", postNo])
                queryClient.invalidateQueries(["post", postNo])
                alert("댓글이 수정되었습니다.");
            } else {
                // 댓글 번호가 없을시 게시글 작성, parentNo는 nullable 이므로 null 이면 댓글, not null 이면 대댓글
                setCommentCont("");
                await CreateComments(postNo, commentCont, parentNo);
                queryClient.invalidateQueries(["commentDto", postNo])
                queryClient.invalidateQueries(["post", postNo])
                alert("댓글이 등록되었습니다.");
            }
        } catch (error) {
            console.error("댓글 처리 실패:", error);
            alert("오류가 발생했습니다.");
        } finally {
            queryClient.invalidateQueries(["post", postNo])
            queryClient.invalidateQueries(["commentDto", postNo])
            setIsSubmitting(false);
        }
    };
  if(loginUser!==null)  return (
        <Form onSubmit={handleSubmit}>
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
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "작성 중..." : "작성하기"}
                </Button>
            </div>
        </Form>
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