const ServerUrl='http://localhost:8801/api/community'
// const token=localStorage.getItem('jwt');
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
export async function CreateComments(postNo,commentCont,parentNo){
    const URL=`${ServerUrl}/comments?postNo=${postNo}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            // Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"},
        body: JSON.stringify({commentCont:commentCont,postNo:postNo,parentNo:parentNo})
    });
    if(!res.ok) throw new Error(res.status+"");
    const data= await res.json();
    return data
}
export async function DeleteComment(commentNo){
    const URL=`${ServerUrl}/comments?commentNo=${commentNo}`;
    const res = await fetch(URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json"},
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("댓글이 삭제되었습니다.")
    return res;
}
export async function ModifyComment({commentNo,commentCont}){
    const URL=`${ServerUrl}/comments`;
    const res = await fetch(URL, {
        method: "PUT",
        headers: {
            // Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"},
        body: JSON.stringify({id:commentNo,commentCont:commentCont})
    })
    if(!res.ok) throw new Error(res.status+"");
    return res.json();
}