const BASE_URL = 'http://localhost:8801/api/users';

export async function fetchMyInfo() {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${BASE_URL}/me`, {
        headers: {
            "Authorization": `Bearer ${jwt}`
        }
    });
    if (!res.ok) throw new Error('사용자 정보 불러오기 실패');
    return res.json();
}

export async function updateNickname(nickname) {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${BASE_URL}/me`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({ nickname })
    });
    if (!res.ok) throw new Error('닉네임 변경 실패');
    return res.json();
}

export async function updateSelfIntroduction(selfIntroduction) {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`${BASE_URL}/me`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${jwt}`
        },
        body: JSON.stringify({ selfIntroduction })
    });
    if (!res.ok) throw new Error('자기소개 변경 실패');
    return res.json();
}
