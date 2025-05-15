import { Button } from "react-bootstrap";
import {useGetPostLikeStatus, useTogglePostLike} from "../CommunityHook/togglePostLike.js";
import {memo, useContext} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";
import {useQueryClient} from "@tanstack/react-query";
import SmallLoading from "../CommunityForm/SmallLoading.jsx";

export const PostLikeComponent=memo (function PostLikeComponent({ postNo, category }) {
    const [loginUser] = useContext(UseLoginUserContext);
    const { data, isFetching, isLoading } = useGetPostLikeStatus(postNo);
    const togglePostLike = useTogglePostLike(postNo);
    const queryClient=useQueryClient();
    if (isLoading || isFetching || !data || typeof data.likeCount !== "number") {
        return <SmallLoading/>; //로딩창 호출
    }
    const currentUserLike = data.userLikeType;
    const handleClick = (type) => {
        togglePostLike.mutate(type);
        queryClient.invalidateQueries(["posts",category])
    };

    return (
        <div style={{display: "flex"}}>
            <Button
                variant={currentUserLike === true ? "primary" : "outline-primary"}
                onClick={() => handleClick(true)}
                disabled={!loginUser}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    justifyContent: "center",
                    display: "flex",
                    marginRight:"0.1rem"}}
            >
                <img
                    src="/images/like.png"
                    alt=""
                    width="20rem" height="20rem" style={{marginTop:"0.18rem"}}
                />
                {data.likeCount}
            </Button>
            <Button
                variant={currentUserLike === false ? "danger" : "outline-danger"}
                onClick={() => handleClick(false)}
                disabled={!loginUser}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    justifyContent: "center",
                    display: "flex"}}
            >
                <img
                    src="/images/dislike.png"
                    alt=""
                    width="20rem" height="20rem" style={{marginTop:"0.18rem"}}
                />
                {data.dislikeCount}
            </Button>
        </div>
    );
})

