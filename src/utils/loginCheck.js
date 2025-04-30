const ServerUrl='http://localhost:8801'
// 로그인 fetch 주소임 그리고 저 함수도 강사님 강의랑 gpt 참조해서 만든것
export async function loadCheckLogin() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
        return null;
    }
    const response = await fetch(`${ServerUrl}/user/jwt/check.do`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + jwt,
            "content-type": "application/json"
        },
    });
    if (!response.ok) {
        localStorage.removeItem("jwt");
        return null;
    }
    const data = await response.json();
    localStorage.setItem("jwt", jwt);
    return data;
}