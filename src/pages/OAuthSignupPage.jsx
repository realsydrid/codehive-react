import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UseLoginUserContext } from "../provider/LoginUserProvider.jsx";

export default function OAuthSignupPage() {
    const navigate = useNavigate();
    const [, setLoginUser] = useContext(UseLoginUserContext);
    const location = useLocation();
    if (!location.state || !location.state.user) {
        return <div className="text-center mt-5">잘못된 접근입니다. 다시 로그인해주세요.</div>;
    }
    const { user, error } = location.state || {};

    const [form, setForm] = useState({
        email: user?.email || "",
        name: user?.name || "",
        nickname: "",
        gender: "",
        birthDate: "",
        oauth: user?.oauth || "GOOGLE",
        picture: user?.picture || "",
        privacy_agreements: false,
        marketing_agreements: false
    });

    const [errMsg, setErrMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg("");

        try {
            const response = await fetch("http://localhost:8801/user/oauth/signup.do", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                throw new Error("회원가입 실패");
            }

            const { jwt, user: userData } = await response.json();
            localStorage.setItem("jwt", jwt);
            setLoginUser(userData);
            navigate("/");

        } catch (err) {
            console.error(err);
            setErrMsg("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
            <h2 className="text-center mb-4">소셜 회원가입</h2>
            {error && <div className="alert alert-warning">{error}</div>}
            {errMsg && <div className="alert alert-danger">{errMsg}</div>}

            <form onSubmit={handleSubmit}>
                <input type="text" name="email" className="form-control mb-3" value={form.email} readOnly />
                <input type="text" name="name" className="form-control mb-3" value={form.name} readOnly />
                <input type="text" name="nickname" placeholder="닉네임" className="form-control mb-3" value={form.nickname} onChange={handleChange} required />

                <label>생년월일</label>
                <input type="date" name="birthDate" className="form-control mb-3" value={form.birthDate} onChange={handleChange} required />

                <select name="gender" className="form-control mb-3" value={form.gender} onChange={handleChange} required>
                    <option value="">성별 선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                </select>
                <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" id="privacy" name="privacy_agreements" checked={form.privacy_agreements} onChange={handleChange} required />
                    <label className="form-check-label" htmlFor="privacy">개인정보 수집 및 이용에 동의합니다.</label>
                </div>

                <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="marketing" name="marketing_agreements" checked={form.marketing_agreements} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="marketing">마케팅 정보 수신에 동의합니다. (선택)</label>
                </div>

                <button type="submit" className="btn btn-primary w-100">가입하기</button>
            </form>
        </div>
    );
}