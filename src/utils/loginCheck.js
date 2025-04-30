const ServerUrl='http://localhost:8801'
//모든 요청에 로그인 정보인 jwt를 해더에 포함하는 커스텀 fetch
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