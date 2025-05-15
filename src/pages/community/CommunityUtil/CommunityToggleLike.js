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
    if (res.status === 204) {
        alert("상태 취소!") // 성공이지만 내용 없음을 확인 알람용 (예: 좋아요 취소)
        return { userLikeType: null }; // 프론트에서 이걸로 처리하게
    }
    if(!res.ok){
        throw new Error("좋아요/싫어요 상태변경 실패!");
    }
    const data = await res.json();
    // 정상 JSON 응답 처리
    return data;
}
//GetCommentLikeType은 구조가 달라서, comment Data 안에 userLikeType 까지 한번에 들어있어서
//거기서 처리하도록 유도함 하여 여기엔 GetCommentLikeType은 없음
export async function GetPostLikeType(postNo){
    const URL = `${ServerUrl}/posts/${postNo}`;
    const jwt=localStorage.getItem('jwt');
    const res = await fetch(URL, {
        method: "GET",
        headers: {
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
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
export async function TogglePostLike(postNo, userLikeType) {
    const URL = `${ServerUrl}/posts/${postNo}`;
    const jwt = localStorage.getItem("jwt");
    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userLikeType }), // ✅ 서버가 기대하는 필드명
        });

        if (res.status === 204) {
            alert("반영이 안됬어요")
            return { userLikeType: null };
        }
        if (!res.ok) {
            console.log(res)
            console.error("API 요청 실패:", res.status+"");
            return null;
        }
        const data = await res.json();
        return data
    } catch (error) {
        console.error("토글 요청 중 예외 발생:", error);
        return null;
    }
}