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
export async function GetFreePosts(){
    await new Promise(resolve => setTimeout(resolve, 2000));
    const URL=`http://localhost:8801/rest/community/read/free`
    const res= await fetch(URL);
    if(!res.ok) throw new Error(res.status+"");
    const data=await res.json();
    console.log(data);
    return data
}