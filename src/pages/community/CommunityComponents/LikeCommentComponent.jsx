import { useToggleCommentLike } from "../CommunityHook/toggleCommentLike.js";
import { Button } from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";


export function CommentLikeComponent({ comment, postNo }) {
    const [loginUser] = useContext(UseLoginUserContext);
    const { mutate } = useToggleCommentLike(Number(comment.id), postNo);
    //  likeType 상태를 로컬로 유지
    const [localLikeType, setLocalLikeType] = useState(comment.userLikeType);

    // comment가 바뀌면 로컬 상태 동기화
    useEffect(() => {
        setLocalLikeType(comment.userLikeType);
    }, [comment.userLikeType]);

    const handleClick = (type) => () => {
        const nextLikeType = localLikeType === type ? null : type;
        setLocalLikeType(nextLikeType); // 선반영 UI 상태 변경
        mutate(nextLikeType);
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button
                variant={localLikeType === true ? "primary" : "outline-primary"}
                onClick={handleClick(true)}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    display: "flex",
                    marginRight: "4px",
                }}
                disabled={!loginUser}
            >
                <img src="/images/like.png" alt="like" width="20rem" height="20rem" />
                {comment.likeCount}
            </Button>

            &nbsp;

            <Button
                variant={localLikeType === false ? "danger" : "outline-danger"}
                onClick={handleClick(false)}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    display: "flex",
                }}
                disabled={!loginUser}
            >
                <img src="/images/dislike.png" alt="dislike" width="20rem" height="20rem" />
                {comment.dislikeCount}
            </Button>
        </div>
    );
}