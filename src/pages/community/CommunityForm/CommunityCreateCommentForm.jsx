import {CreateComments, CreatePosts} from "../CommunityFetch.js";
import {useState} from "react";
import {redirect} from "react-router-dom";

export default function CommunityCreateCommentForm(postNo){
    const [commentCont, setCommentCont] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const selectedPost=postNo.postNo;
    const userNo=postNo.userNo;
    const handleSubmit = async (e) => {
        // if (!postCont.trim()) return;
        setIsSubmitting(true);
        try {
            if(commentCont === ""){
                setIsSubmitting(false);
                alert("내용을 입력해주세요!")
                e.preventDefault()
            }
            else{
                await CreateComments(selectedPost,commentCont,userNo);
                alert("댓글이 성공적으로 등록되었습니다.");
                setCommentCont("");}
            redirect(`http://localhost:5173/posts/${selectedPost}`);
        } catch (error) {
            console.error("댓글 생성 실패:", error);
            alert("댓글 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form style={{width:"80%", height:"200px",display:"flex", justifyContent:"center", alignItems:"center",flexDirection:"column",
                minWidth:"800px",maxWidth:"1500px"}} onSubmit={handleSubmit}>
                <div>
                    <input type="hidden" value={selectedPost}/>
                    <textarea name="postCont" placeholder={'안녕하세요! 자유롭게 이용하시되 이용정첵에 ' +
                        '위배되는 글이나 특정 사용자를 비방하는 댓글을 게시할 경우에는 제재가 될 수 있습니다.'}
                              style={{minWidth:"800px",maxWidth:"1500px", height:"200px",resize:"none",fontSize:"20px"}}
                              value={commentCont} disabled={isSubmitting} onChange={(e)=>setCommentCont(e.target.value)}></textarea>
                    <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"center",minWidth:"800px",maxWidth:"1500px"}}>
                        <button  type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "게시 중..." : "게시하기"}</button>
                    </div>
                </div>
            </form>
        </>
    )
}