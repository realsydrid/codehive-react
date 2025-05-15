import { useToggleCommentLike } from "../CommunityHook/toggleCommentLike.js";
import { Button } from "react-bootstrap";
import {useContext} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";


export function CommentLikeComponent({ comment, postNo }) {
    const [loginUser] = useContext(UseLoginUserContext);
    const { mutate } = useToggleCommentLike(Number(comment.id), postNo);

    const handleClick = (type) => () => {
        // 로그인하지 않았으면 클릭 불가
        if (!loginUser) return;

        if (comment.userLikeType === type) {
            mutate(null); // 같은 타입이면 취소
        } else {
            mutate(type); // 다른 타입이면 변경
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button
                variant={comment.userLikeType === true ? "primary" : "outline-primary"}
                onClick={handleClick(true)}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    justifyContent: "center",
                    display: "flex",
                marginRight:"0.1rem"}}
                disabled={!loginUser}
            >
                <img src="/images/like.png" alt="" width="20rem" height="20rem" style={{marginTop:"0.18rem"}}/>
                {comment.likeCount}
            </Button>

            &nbsp;

            <Button
                variant={comment.userLikeType === false ? "danger" : "outline-danger"}
                onClick={handleClick(false)}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    justifyContent: "center",
                    display: "flex"}}
                disabled={!loginUser}
            >
                <img src="/images/dislike.png" alt="" width="20rem" height="20rem" style={{marginTop:"0.18rem"}}/>
                {comment.dislikeCount}
            </Button>
        </div>
    );
}