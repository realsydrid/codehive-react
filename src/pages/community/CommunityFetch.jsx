export async function readPost(postNo){
    const URL=`http://localhost:8801/rest/community/read/${postNo}/postDetail`
    const res= await fetch(URL);
    if(!res.ok){
        throw new Error(res.status+"");
    }
    const data=await res.json();
    console.log(data);
    return data
}
export async function getPosts(category){
    await new Promise(resolve => setTimeout(resolve, 1000));
    const URL=`http://localhost:8801/rest/community/read/${category}`
    const res= await fetch(URL);
    if(!res.ok) throw new Error(res.status+"");
    const data=await res.json()
    return data
}