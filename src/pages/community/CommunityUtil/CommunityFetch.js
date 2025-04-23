const ServerUrl='http://localhost:8801/api/community'

export async function ReadPost(postNo){
    const URL=`${ServerUrl}/post?postNo=${postNo}`
    const res = await fetch(URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if(!res.ok){
        throw new Error(res.status+"");
    }
    const data=await res.json();
    console.log(data);
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
    console.log(data)
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
    console.log(data)
    return data
}
export async function CreateComments(postNo,commentCont,userNo){
    const URL=`${ServerUrl}/comments?postNo=${postNo}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({commentCont,userNo})
    });
    if(!res.ok) throw new Error(res.status+"");
    const data= await res.json();
    console.log(data)
    return data
}