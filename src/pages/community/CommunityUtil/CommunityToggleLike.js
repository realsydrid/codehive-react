const ServerUrl='http://localhost:8801/api/community/LikeStatus'
// const jwt=localStorage.getItem('jwt');

export async function GetCommentLikeType(userNo,commentNo){
    const URL = `${ServerUrl}/comments/${commentNo}?userNo=${userNo}`;
    const res = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (!res.ok) {
        return { likeType: null }; // 강제 fallback
    }
    const data = await res.json();
    return { likeType: data?.likeType ?? null };
}
export async function ToggleCommentLike({userNo,commentNo,likeType}){
    const URL = `${ServerUrl}/comments/${commentNo}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            // Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userNo,commentNo,likeType}),
    });
    if(!res.ok){
        alert("입력실패!")
        throw new Error("좋아요/싫어요 상태변경 실패!");
    }
    if (res.status === 204) {
        return { likeType: null };
    }
    // 정상 JSON 응답 처리
    const data = await res.json();
    return data ?? null;
}
export async function GetPostLikeType(userNo, postNo){
    const URL = `${ServerUrl}/posts/${postNo}?userNo=${userNo}`;
    const res = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if(!res.ok){
        throw new Error(res.status+"");
    }
    if (res.status === 204) {
        return { likeType: null };
    }
    // 정상 JSON 응답 처리
    const data = await res.json();
    return data ?? null;
}
export async function TogglePostLike({userNo,postNo,likeType}){
    const URL = `${ServerUrl}/posts/${postNo}`;
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            // Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userNo,postNo,likeType}),
    });
    if (!res.ok) {
        throw new Error(`오류번호: ${res.status}`);
    }
    const text = await res.text();
    if (!text) {
        // 응답 본문이 비었으면 null 반환
        return null;
    }
    try {
        // 데이터가 정상일때 이 text를 json을 형변환 하겠다
        const data = JSON.parse(text);
        return data ?? null;
    } catch (e) {
        console.error("JSON 파싱 오류:", e);
        return null;
    }
}