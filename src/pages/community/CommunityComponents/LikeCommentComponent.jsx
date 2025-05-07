import { useGetCommentLikeStatus, useToggleCommentLike } from "../CommunityHook/toggleCommentLike.js";
import { Button } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";

export function CommentLikeComponent({ loginUserNo, comment, disabled }) {
    const userNo = Number(loginUserNo);
    const commentNo = Number(comment.id);
    const postNo = Number(comment.postNo);

    const queryClient = useQueryClient();
    const { mutate: toggleLike } = useToggleCommentLike();
    const { data: likeStatus } = useGetCommentLikeStatus(userNo, commentNo, postNo);

    const cachedComments = queryClient.getQueryData(["commentDto", postNo]);
    const cachedComment = cachedComments?.find(c => c.dto.commentNo === commentNo);

    const likeCount = cachedComment?.dto.likeCount ?? comment.likeCount;
    const dislikeCount = cachedComment?.dto.dislikeCount ?? comment.dislikeCount;

    const currentLikeType =
        cachedComment?.userLikeType ??
        likeStatus?.userLikeType ??
        null;

    const handleClick = (type) => {
        const newType = currentLikeType === type ? null : type;
        toggleLike({
            commentNo: commentNo,
            userNo: userNo,
            likeType: newType,
            postNo: postNo,
        });
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button
                variant={currentLikeType === true ? "primary" : "outline-primary"}
                onClick={() => handleClick(true)}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    display: "flex",
                    marginRight: "4px",
                }}
                disabled={disabled}
            >
                <img src="/images/like.png" alt="" width="20rem" height="20rem" />{likeCount}
            </Button>

            &nbsp;

            <Button
                variant={currentLikeType === false ? "danger" : "outline-danger"}
                onClick={() => handleClick(false)}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    display: "flex",
                }}
                disabled={disabled}
            >
                <img src="/images/dislike.png" alt="" width="20rem" height="20rem" />{dislikeCount}
            </Button>
        </div>
    );
}