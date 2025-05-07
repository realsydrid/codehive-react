const ServerUrl='http://localhost:8801/api/community/LikeStatus'
const jwt=localStorage.getItem('jwt');

export async function GetCommentLikeType(postNo){
    const URL = `${ServerUrl}/posts/${postNo}/comments`;
    const res = await fetch(URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
    });
    if (!res.ok) {
        throw new Error(res.status+"");
    }
    const data = await res.json();
    return data;
}
export async function ToggleCommentLike({userNo,commentNo,likeType}){
    const URL = `${ServerUrl}/comments/${commentNo}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userNo,commentNo,likeType}),
    });
    if(!res.ok){
        alert("입력실패!")
        throw new Error("좋아요/싫어요 상태변경 실패!");
    }
    if (res.status === 204) {
        return {userNo:userNo,commentNo:commentNo,likeType: null };
    }
    console.log(res.json());
    // 정상 JSON 응답 처리
    return res ?? null;
}
export async function GetPostLikeType(userNo, postNo){
    const URL = `${ServerUrl}/posts/${postNo}`;
    const res = await fetch(URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
    });
    if(!res.ok){
        throw new Error(res.status+"");
    }
    // 정상 JSON 응답 처리
    const data = await res.json();
    return data;
}
export async function TogglePostLike({ userNo, postNo, likeType }) {
    const URL = `${ServerUrl}/posts/${postNo}`;

    const body = { userNo, postNo, likeType:likeType };

    const res = await fetch(URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        console.error("API 요청 실패:", res.status);
        return null;
    }
    if (res.status === 204) {
        return { userNo:userNo,postNo:postNo,likeType: null };
    }
    const data = await res.json();  // 바로 JSON 형태로 변환
    return data ?? null;
}