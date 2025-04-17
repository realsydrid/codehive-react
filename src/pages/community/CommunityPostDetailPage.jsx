import {useEffect, useState} from "react";
import {GetComments, ReadPost} from "./CommunityFetch.jsx";
import {useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Loading from "./Loading.jsx";
import ErrorMsg from "./ErrorMsg.jsx";

export default function CommunityPostDetailPage() {
    const {postNo}=useParams();
    const {data:post,isLoading,error}=useQuery({
        queryKey:["id",postNo],
        queryFn:async ()=>ReadPost(postNo),
        staleTime:1000*60*5,
        cacheTime:1000*60*10,
        retry : 1,
    })
    const {data:comment}=useQuery(
        {
            queryKey:["id",postNo],
            queryFn:async ()=>GetComments(postNo),
            staleTime:1000*60*5,
            cacheTime:1000*60*10,
            retry : 1,
        }
    )
        return (
            <>
                {isLoading && <h1><Loading/></h1>}
                {error && <h1><ErrorMsg error={error}/></h1>}
                {post &&
                <div className="CommunityPostDetail">
                    <div className={"userInfo"}>
                        <span>{post.userNickname}</span>
                        <span>Lv.{post.userId}</span>
                    </div>
                    <div>
                    <h1>{post.postCont}</h1>
                        <span>{post.postCreatedAt}</span>
                        <div className={"postInfo"}>
                            <button type={"button"} >좋아요{post.likeCount}개</button>
                            <button type={"button"}>싫어요{post.dislikeCount}개</button>
                            <span>댓글{post.commentCount}개</span>
                        </div>
                    </div>
                    {comment && comment.map(comment =>
                    <div key={comment.id} className={"comment"}>
                        <span>{comment.commentCont}</span>
                        <span>{comment.commentCreatedAt}</span>
                        <button type={"button"}>대댓글 보기</button>
                    </div>)}
                </div>
                }
            </>
        )
    }