
import {GetComments, ReadPost} from "./CommunityFetch.jsx";
import {Link, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Loading from "./Loading.jsx";
import ErrorMsg from "./ErrorMsg.jsx";

export default function CommunityPostDetailPage() {
    const {postNo}=useParams();
    const {data:post,isLoading,error}=useQuery({
        queryKey:["post",postNo],
        queryFn:async ()=>ReadPost(postNo),
        staleTime:1000*60*5,
        cacheTime:1000*60*10,
        retry : 1,
    })
    const {data:comment}=useQuery(
        {
            queryKey:["comment",postNo],
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
                <div className="CommunityPostDetail">
                    {post && post.map(post=>

                            <div>
                                <Link to={`/community/${post.category}`}>게시판으로 돌아가기</Link>
                                <div className={"UserInfo"}>
                                    <Link to={"/users/profile/" + post.userId}>
                                        <img src={post.userProfileImgUrl ? post.userProfileImgUrl : "/images/user_icon_default.png"} alt=""/>
                                        <span>{post.userNickname}</span>
                                        <span>Lv.{post.userId}</span>
                                    </Link>
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
                            </div>

                    )}
                    {comment && comment.map(c => (
                        <div
                            key={c.id}
                            className="comment"
                            style={{ display: c.parentNo ? "none" : "block" }} // ✅ parentNo가 있으면 숨김
                        >
                            <span>{c.commentCont}</span>
                            <span>{c.commentCreatedAt}</span>
                            <button type="button">대댓글 보기</button>
                        </div>
                    ))}
                        </div>
            </>)
    //post =>
        //comment =>
    }
