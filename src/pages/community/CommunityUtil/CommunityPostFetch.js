const ServerUrl='http://localhost:8801/api/community'
const token=localStorage.getItem('jwt');

export async function ReadPost(postNo){
    const URL=`${ServerUrl}/posts/detail?postNo=${postNo}`
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

export async function GetPosts(category,page,size){
    const URL=`${ServerUrl}/posts?category=${category}&page=${page}&size=${size}`;
    const res = await fetch(URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if(!res.ok) throw new Error(res.status+"");
    const data= await res.json();
    return data
}
export async function CreatePosts(category,postCont,userNo){
    const URL=`${ServerUrl}/posts?category=${category}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({postCont,userNo})
    });
    if(!res.ok) throw new Error(res.status+"");
    const data= await res.json();
    return data
}
export async function DeletePost(postNo,userNo){
    const URL=`${ServerUrl}/posts?postNo=${postNo}&userNo=${userNo}`;
    const res = await fetch(URL, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
            },
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("게시글이 삭제되었습니다.")
    return res;
}
export async function ModifyPost(postNo,userNo,postCont){
    const URL=`${ServerUrl}/posts?postNo=${postNo}&userNo=${userNo}`;
    const res = await fetch(URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({postNo:postNo,userNo:userNo,postCont:postCont})
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("게시글이 수정되었습니다.")
    return res.json();
}