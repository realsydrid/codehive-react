import { useGetCommentLikeStatus, useToggleCommentLike } from "../CommunityHook/toggleCommentLike.js";
import { Button } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";

export function CommentLikeComponent({ loginUserNo, comment }) {
    const { data: likeStatus } = useGetCommentLikeStatus(loginUserNo, comment.id);
    const { mutate: toggleLike } = useToggleCommentLike();
    const queryClient = useQueryClient();
    const currentLikeType = likeStatus?.likeType;

    const handleClick = (type) => {
        const newType = currentLikeType === type ? null : type;

        // 현재 눌린 상태를 기준으로 다음 상태를 캐시에 반영해야 함
        queryClient.setQueryData(["commentLikeStatus", loginUserNo, comment.id], {
            likeType: newType,
        });
        toggleLike({
            commentNo: comment.id,
            userNo: loginUserNo,
            likeType: newType,
            postNo: comment.postNo,
        });
    };

    return (
        <div>
            <Button
                variant={currentLikeType === 1 ? "primary" : "outline-primary"}
                onClick={() => handleClick(1)}
                style={{borderRadius: "3000px",width: "2.75rem" ,height: "2.75rem",justifyContent:"center"}}
            >
                <img src="/images/like.png" alt="Like" width="20rem" height="20rem" style={{marginBottom: "0.2rem"}}/>
            </Button>{" "}
            {comment.likeCount}
            &nbsp;
            <Button
                variant={currentLikeType === 0 ? "danger" : "outline-danger"}
                onClick={() => handleClick(0)}
                style={{borderRadius: "3000px",width: "2.75rem" ,height: "2.75rem"}}
            >
                <img src="/images/dislike.png" alt="Dislike" width="20rem" height="20rem" style={{marginBottom: "0.2rem"}} />
            </Button>{" "}
            {comment.dislikeCount}
        </div>
    );
}