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
export async function CreateComments(postNo,commentCont){
    const URL=`${ServerUrl}/comments?postNo=${postNo}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({commentCont:commentCont,postNo:postNo})
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
export async function ModifyComment(commentNo,commentCont){
    const URL=`${ServerUrl}/comments?commentNo=${commentNo}`;
    const res = await fetch(URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({commentNo:commentNo,commentCont:commentCont})
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("댓글이 수정되었습니다.")
    return res.json();
}
export async function GetLikeComment(commentNo,userNo){
    const URL=`${ServerUrl}/comments/${commentNo}?userNo=${userNo}`;
    const response = await fetch(URL, {
        method: "GET",
        headers: { "Content-Type": "application/json"},
    })
        .then(response => {
            if (!response.ok) throw new Error('서버 오류');
            return response.json();
        })
        .then(data => {
            console.log('현재 상태:', data);
        })
        .catch(error => {
            console.error('에러 발생:', error);
        });
    const data=response.json();
    return data
}