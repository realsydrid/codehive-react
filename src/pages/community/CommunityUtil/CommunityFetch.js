import {redirect} from "react-router-dom";

const ServerUrl='http://localhost:8801/api/community'
const redirectUrl=''

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({postCont,userNo})
    });
    if(!res.ok) throw new Error(res.status+"");
    const data= await res.json();
    return data
}
export async function CreateComments(postNo,userNo,commentCont){
    const URL=`${ServerUrl}/comments?postNo=${postNo}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({commentCont:commentCont,postNo:postNo,userNo:userNo})
    });
    if(!res.ok) throw new Error(res.status+"");
    const data= await res.json();
    console.log(res)
    console.log(data)
    return data
}
export async function DeleteComment(postNo,commentNo,userNo){
    const URL=`${ServerUrl}/comments?commentNo=${commentNo}&userNo=${userNo}`;
    const res = await fetch(URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("댓글이 삭제되었습니다.")
    return redirect(`${redirectUrl}/posts/${postNo}`);
}
export async function DeletePost(category,postNo,userNo){
    const URL=`${ServerUrl}/comments?postNo=${postNo}&userNo=${userNo}`;
    const res = await fetch(URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("댓글이 삭제되었습니다.")
    return redirect(`${redirectUrl}/posts/${category}`);
}