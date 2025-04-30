const ServerUrl='http://localhost:8801/api/community'
const token=localStorage.getItem('jwt');
export async function GetComments(postNo){
    const URL=`${ServerUrl}/comments?postNo=${postNo}`
    const res = await fetch(URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if(!res.ok){
        throw new Error(res.status+"");
    }
    const data=await res.json();
    return data
}
export async function CreateComments(postNo,userNo,commentCont){
    const URL=`${ServerUrl}/comments?postNo=${postNo}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`},
        body: JSON.stringify({commentCont:commentCont,postNo:postNo,userNo:userNo})
    });
    if(!res.ok) throw new Error(res.status+"");
    const data= await res.json();
    return data
}
export async function DeleteComment(commentNo,userNo){
    const URL=`${ServerUrl}/comments?commentNo=${commentNo}&userNo=${userNo}`;
    const res = await fetch(URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`},
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("댓글이 삭제되었습니다.")
    return res;
}
export async function ModifyComment(commentNo,userNo,commentCont){
    const URL=`${ServerUrl}/comments?commentNo=${commentNo}&userNo=${userNo}`;
    const res = await fetch(URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${token}`},
        body: JSON.stringify({commentNo:commentNo,userNo:userNo,commentCont:commentCont})
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("댓글이 수정되었습니다.")
    return res.json();
}