import { useGetCommentLikeStatus, useToggleCommentLike } from "../CommunityHook/toggleCommentLike.js";
import { Button } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";


export function CommentLikeComponent({ loginUserNo, comment }) {
    const queryClient = useQueryClient();

    const { data: likeStatus } = useGetCommentLikeStatus(loginUserNo, comment.id, comment.postNo);
    const { mutate: toggleLike } = useToggleCommentLike();

    const currentLikeType = likeStatus?.likeType ?? null;

    // 🔥 최신 댓글 리스트 캐시에서 현재 댓글 정보 추출
    const cachedComments = queryClient.getQueryData(["commentDto", comment.postNo]);
    const cachedComment = cachedComments?.find(c => c.dto.commentId === comment.id);

    // 최신 값 사용, 없으면 초기값 fallback
    const likeCount = cachedComment?.dto.likeCount ?? comment.likeCount;
    const dislikeCount = cachedComment?.dto.dislikeCount ?? comment.dislikeCount;

    const handleClick = (type) => {
        const newType = currentLikeType === type ? null : type;

        // 선반영 상태 캐시에 바로 반영
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
            >
                <img src="/images/like.png" alt="" width="20rem" height="20rem" />
            </Button>{" "}
            {likeCount}
            &nbsp;
            <Button
                variant={currentLikeType === 0 ? "danger" : "outline-danger"}
                onClick={() => handleClick(0)}
            >
                <img src="/images/dislike.png" alt="" width="20rem" height="20rem" />
            </Button>{" "}
            {dislikeCount}
        </div>
    );
}