export async function ReadPost(postNo){
    const URL=`http://localhost:8801/rest/community/read/${postNo}/postDetail`
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
    const URL=`http://localhost:8801/rest/community/read/${postNo}/comments`
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
export async function GetPosts(category,page){
    const URL=`http://localhost:8801/rest/community/read/${category}/${page}`;
    const res = await fetch(URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if(!res.ok) throw new Error(res.status+"");
    const data= await res.json();
    return data
}