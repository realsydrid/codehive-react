import { useGetCommentLikeStatus, useToggleCommentLike } from "../CommunityHook/toggleCommentLike.js";
import { Button } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";


export function CommentLikeComponent({ loginUserNo, comment }) {
    const queryClient = useQueryClient();

    // 현재 좋아요 상태 가져오기
    const { data: likeStatus } = useGetCommentLikeStatus(loginUserNo, comment.id);
    const { mutate: toggleLike } = useToggleCommentLike();

    const currentLikeType = likeStatus?.likeType ?? null;

    const handleClick = (type) => {
        const newType = currentLikeType === type ? null : type;

        // 1. 개별 상태 먼저 선반영
        queryClient.setQueryData(["commentLikeStatus", loginUserNo, comment.id], {
            likeType: newType,
        });
        console.log("commentDto cache", queryClient.getQueryData(["commentDto", comment.postNo]));
        // 2. 서버 요청 (postNo는 댓글에서 꺼내옴)
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
                style={{
                    borderRadius: "3000px",
                    width: "2.75rem",
                    height: "2.75rem",
                    justifyContent: "center"
                }}
            >
                <img
                    src="/images/like.png"
                    alt=""
                    width="20rem"
                    height="20rem"
                    style={{ marginBottom: "0.2rem" }}
                />
            </Button>{" "}
            {comment.likeCount}
            &nbsp;
            <Button
                variant={currentLikeType === 0 ? "danger" : "outline-danger"}
                onClick={() => handleClick(0)}
                style={{
                    borderRadius: "3000px",
                    width: "2.75rem",
                    height: "2.75rem"
                }}
            >
                <img
                    src="/images/dislike.png"
                    alt=""
                    width="20rem"
                    height="20rem"
                    style={{ marginBottom: "0.2rem" }}
                />
            </Button>{" "}
            {comment.dislikeCount}
        </div>
    );
}