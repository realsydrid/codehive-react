// const ServerUrl='http://localhost:8801/api/community/LikeStatus'
const ServerUrl='/api/community/LikeStatus'
export async function ToggleCommentLike(commentNo,userLikeType){
    const URL = `${ServerUrl}/comments/${commentNo}`;
    const jwt=localStorage.getItem('jwt');
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userLikeType:userLikeType}),
    });
    if(!res.ok){
        alert("입력실패!")
        throw new Error("좋아요/싫어요 상태변경 실패!");
    }
    const data = await res.json();
    // 정상 JSON 응답 처리
    return data;
}
export async function GetPostLikeType(userNo, postNo){
    const URL = `${ServerUrl}/posts/${postNo}`;
    const jwt=localStorage.getItem('jwt');
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
    const jwt=localStorage.getItem('jwt');
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