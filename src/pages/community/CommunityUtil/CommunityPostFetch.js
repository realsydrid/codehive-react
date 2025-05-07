const ServerUrl='http://localhost:8801/api/community'
const jwt=localStorage.getItem('jwt');

export async function GetPost(postNo){
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
export async function CreatePost(category, postCont){
    const URL=`${ServerUrl}/posts?category=${category}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
            },
        body: JSON.stringify({category:category,postCont:postCont})
    });
    if(!res.ok) {
        throw new Error(res.status+"");
    }
    const data= await res.json();
    console.log(data);
    return data;
}
export async function DeletePost(postNo){
    const URL=`${ServerUrl}/posts?postNo=${postNo}`;
    const res = await fetch(URL, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
            },
    })
    if(!res.ok) throw new Error(res.status+"");
    alert("게시글이 삭제되었습니다.")
    return res;
}
export async function ModifyPost(postNo,postCont){
    const URL=`${ServerUrl}/posts?postNo=${postNo}`;
    const res = await fetch(URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({postNo:postNo,postCont:postCont})
    })
    if(!res.ok) throw new Error(res.status+"");
    return res.json();
}