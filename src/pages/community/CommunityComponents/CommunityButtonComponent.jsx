import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";
import {DeletePost} from "../CommunityUtil/CommunityPostFetch.js";
import {useContext} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";

export function DeletePostBtn({userNo,postNo}) {
    const [loginUser,]=useContext(UseLoginUserContext)
    const loginUserNo=loginUser?.id;
    async function DeletePostHandler() {
        if (!confirm('정말 게시글을 삭제하시겠습니까?')) {
            alert('게시글 삭제를 취소합니다.');
            return;
        }
        try {
            await DeletePost(postNo);
            alert('게시글이 삭제되었습니다.');
            return postNo = null;
        } catch (error) {
            alert(error + ' 오류로 인해 게시글 삭제에 실패했습니다.');
        }
    }
    if(loginUserNo===userNo) return(
        <div style={{
            paddingTop: "2rem",
            display: "flex"
        }}>
            <Button variant="danger" onClick={()=>DeletePostHandler({postNo:Number(postNo)})}>
                삭제하기
            </Button>

            <Link to={`/community/posts/${postNo}/modify`}><Button variant="primary"
                                                                    type={"button"}>수정하기</Button></Link>
        </div>
    )
    if(loginUserNo!==userNo) return null;
}