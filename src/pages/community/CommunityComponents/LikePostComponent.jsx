import { useQueryClient} from "@tanstack/react-query";
import { Button } from "react-bootstrap";
import {useGetPostLikeStatus, useTogglePostLike} from "../CommunityHook/togglePostLike.js";
import ErrorMsg from "../CommunityForm/ErrorMsg.jsx";
import {useEffect, useState} from "react";


export function PostLikeComponent({ loginUserNo, post }) {
    const postNo = post.id;
    const category = post.category;

    const { data: likeStatus } = useGetPostLikeStatus(loginUserNo, postNo,{
        enabled:!!loginUserNo && !!postNo,
    });
    const { mutate: toggleLike, error } = useTogglePostLike(category);

    // ⭐ 로컬 상태로 likeType 관리 → 캐시 변경 시 UI 즉시 반영
    const [localLikeType, setLocalLikeType] = useState(null);

    useEffect(() => {
        if (loginUserNo) {
            setLocalLikeType(likeStatus?.likeType ?? null);
        }
    }, [likeStatus, loginUserNo]);

    const handleClick = (type) => {
        const newType = localLikeType === type ? null : type;
        setLocalLikeType(newType); // 선반영 상태로 UI 반영
        toggleLike({
            userNo: loginUserNo,
            postNo: postNo,
            likeType: newType,
        });
    };

    return (
        <div style={{display: "flex"}}>
            <Button
                variant={localLikeType === true ? "primary" : "outline-primary"}
                onClick={() => handleClick(true)}
                disabled={!loginUserNo}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    justifyContent: "center",
                    display: "flex",
                }}
            >
                <img
                    src="/images/like.png"
                    alt=""
                    width="20rem"
                    height="20rem"
                    style={{ marginBottom: "0.2rem" }}
                />
                {post.likeCount}
            </Button>
            <Button
                variant={localLikeType === false ? "danger" : "outline-danger"}
                onClick={() => handleClick(false)}
                disabled={!loginUserNo}
                style={{
                    borderRadius: "300px",
                    width: "2.75rem",
                    height: "2.75rem",
                    display: "flex",
                }}
            >
                <img
                    src="/images/dislike.png"
                    alt=""
                    width="20rem"
                    height="20rem"
                    style={{ marginBottom: "0.2rem" }}
                />
                {post.dislikeCount}
            </Button>

            {error && <ErrorMsg error={error} />}
        </div>
    );
}

