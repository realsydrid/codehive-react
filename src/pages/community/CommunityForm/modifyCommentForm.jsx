import { ModifyComment} from "../CommunityUtil/CommunityCommentFetch.js";
import {useState} from "react";;
import {Button, Form} from "react-bootstrap";
import "../CommunityTextArea.css";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function CommunityModifyCommentForm(comment){
    const [commentCont, setCommentCont] = useState(comment.commentCont);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (e) => {
        const { commentCont, value } = e.target;
        setCommentCont((prev) => ({ ...prev, [commentCont]: value }));
    };
    const queryClient = useQueryClient();
    const selectedComment=comment.commentNo;
    const userNo=comment.userNo;
    const { mutate } = useMutation({
        mutationFn: ({commentNo,userNo,commentCont})=> ModifyComment(commentNo,userNo,commentCont),
        onSuccess: () => {
            console.log('수정 성공');
            queryClient.invalidateQueries(['comments', comment.postNo]);
            setIsSubmitting(true);
        },
        onError: (error) => {
            console.error('수정 실패:', error);
            setIsSubmitting(false);
        },
    });
    const handleSubmit = () => {
        mutate({commentNo:selectedComment,userNo:userNo, commentCont:commentCont});
    };
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="commentCont">
                <Form.Label column={"lg"}>댓글 수정</Form.Label>
                <Form.Control
                    as="textarea"
                    name="commentCont"
                    placeholder="수정할 내용을 입력해주세요. 운영정책위반시 제재대상이 될 수 있습니다."
                    className={"CreateComment"}
                    value={commentCont}
                    onChange={handleChange}
                />
            </Form.Group>

            <div className="d-flex justify-content-between mt-2">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "수정 중..." : "수정하기"}
                </Button>
            </div>
        </Form>

    )
}