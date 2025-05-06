import { useQueryClient} from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import {useGetPostLikeStatus, useTogglePostLike} from "../CommunityHook/togglePostLike.js";
import ErrorMsg from "../CommunityForm/ErrorMsg.jsx";

export function PostLikeComponent({ loginUserNo, post }) {
    const queryClient = useQueryClient();
    const postNo = post.id;

    // 좋아요 상태 조회
    const { data: likeStatus } = useGetPostLikeStatus(loginUserNo, postNo);
    const { mutate: toggleLike, error } = useTogglePostLike();

    const currentLikeType = likeStatus?.likeType ?? null;

    const handleClick = (type) => {
        const newType = currentLikeType === type ? null : type;

        // UI 선반영
        queryClient.setQueryData(["postLikeStatus", loginUserNo, postNo], { likeType: newType });

        // 서버 반영
        toggleLike({
            userNo: loginUserNo,
            postNo: postNo,
            likeType: newType,
        });
    };

    return (
        <div>
            <Button
                variant={likeStatus?.likeType === true ? "primary" : "outline-primary"}
                onClick={() => handleClick(true)}
                style={{ borderRadius: "300px", width: "2.75rem", height: "2.75rem", justifyContent: "center" }}
            >
                <img src="/images/like.png" alt="" width="20rem" height="20rem" style={{ marginBottom: "0.2rem" }}/>
            </Button>{" "}
            {post.likeCount}
            <Button
                variant={likeStatus?.likeType === false ? "danger" : "outline-danger"}
                onClick={() => handleClick(false)}
                style={{ borderRadius: "300px", width: "2.75rem", height: "2.75rem" }}
            >
                <img src="/images/dislike.png" alt="" width="20rem" height="20rem" tyle={{ marginBottom: "0.2rem" }}/>
            </Button>{" "}
            {post.dislikeCount}

            {/* 에러가 발생하면 에러 메시지 출력 */}
            {error && <ErrorMsg error={error} />}
        </div>
    );
}
