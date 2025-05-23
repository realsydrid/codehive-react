import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UseLoginUserContext } from "../provider/LoginUserProvider.jsx";
import SettingsPrivacyPolicyPage from "./settings/SettingsPrivacyPolicyPage.jsx";

export default function OAuthSignupPage() {
    const ServerUrl = "";
    // const ServerUrl = "http://localhost:8801"
    const navigate = useNavigate();
    const [, setLoginUser] = useContext(UseLoginUserContext);
    const location = useLocation();
    if (!location.state || !location.state.user) {
        return (
            <div className="text-center mt-5">
                <p>해당 구글 계정으로 가입된 사용자가 없습니다.</p>
                <p>회원가입을 진행해주세요.</p>
            </div>
        );
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

    const [checkResult, setCheckResult] = useState({
        nickname: null,
        email: null
    });

    const [errMsg, setErrMsg] = useState("");
    const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);
    const [showMarketingTerms, setShowMarketingTerms] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));

        if (["nickname", "email"].includes(name)) {
            setCheckResult(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const checkDuplicate = async (field) => {
        const value = form[field];

        // 유효성 검사 먼저 수행
        if (field === "nickname" && (value.length < 2 || value.length > 8)) {
            setCheckResult(prev => ({ ...prev, [field]: false }));
            return;
        }

        if (!value) return;

        let url;
        if (field === "nickname") url = `${ServerUrl}/user/check-nickname?nickname=${value}`;
        else if (field === "email") url = `${ServerUrl}/user/check-email?email=${value}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            setCheckResult(prev => ({ ...prev, [field]: !data.exists }));
        } catch (e) {
            console.error(`${field} 중복체크 실패`, e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrMsg("");

        if (!form.privacy_agreements) {
            setErrMsg("개인정보 처리방침에 동의해야 가입할 수 있습니다.");
            return;
        }

        const today = new Date().toISOString().split("T")[0];
        if (form.birthDate > today) {
            setErrMsg("생년월일은 미래 날짜일 수 없습니다.");
            return;
        }

        if (form.nickname.length < 2 || form.nickname.length > 8) {
            setErrMsg("닉네임은 2~8자여야 합니다.");
            return;
        }

        if (checkResult.nickname !== true || checkResult.email !== true) {
            setErrMsg("닉네임과 이메일 중복 확인을 완료해주세요.");
            return;
        }

        try {
            const response = await fetch(`${ServerUrl}/user/oauth/signup.do`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!response.ok) throw new Error("회원가입 실패");

            const { jwt, user: userData } = await response.json();
            localStorage.setItem("jwt", jwt);
            setLoginUser(userData);
            navigate("/");

        } catch (err) {
            console.error(err);
            setErrMsg("회원가입 중 오류가 발생했습니다.");
        }
    };

    const renderValidationText = (field) => {
        if (form[field] === "") return null;

        if (field === "nickname" && (form.nickname.length < 2 || form.nickname.length > 8)) {
            return <div className="form-text mt-0 text-danger">닉네임은 2~8자여야 합니다.</div>;
        }

        if (checkResult[field] === null) return null;

        return (
            <div className="form-text mt-0" style={{ color: checkResult[field] ? "green" : "red" }}>
                {checkResult[field]
                    ? `사용 가능한 ${field === "nickname" ? "닉네임" : "이메일"}입니다.`
                    : `이미 사용 중인 ${field === "nickname" ? "닉네임" : "이메일"}입니다.`}
            </div>
        );
    };

    return (
        <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
            <h2 className="text-center mb-4">소셜 회원가입</h2>
            {error && <div className="alert alert-warning">{error}</div>}
            {errMsg && <div className="alert alert-danger">{errMsg}</div>}

            <form onSubmit={handleSubmit}>
                <input type="text" name="name" className="form-control mb-3" value={form.name} readOnly />

                <div className="d-flex mb-1">
                    <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary ms-2" style={{ whiteSpace: "nowrap", height: "38px" }} onClick={() => checkDuplicate("email")}>중복확인</button>
                </div>
                {renderValidationText("email")}

                <div className="d-flex mb-1">
                    <input type="text" name="nickname" placeholder="닉네임" className="form-control" value={form.nickname} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary ms-2" style={{ whiteSpace: "nowrap", height: "38px" }} onClick={() => checkDuplicate("nickname")}>중복확인</button>
                </div>
                {renderValidationText("nickname")}

                <label className="form-label mt-3">생년월일</label>
                <input type="date" name="birthDate" className="form-control mb-3" value={form.birthDate} onChange={handleChange} required />

                <select name="gender" className="form-control mb-3" value={form.gender} onChange={handleChange} required>
                    <option value="">성별 선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                </select>

                <div className="form-check mb-2">
                    <input className="form-check-input" type="checkbox" id="privacy" name="privacy_agreements" checked={form.privacy_agreements} onChange={handleChange} required />
                    <label className="form-check-label" htmlFor="privacy">[필수] 개인정보 수집 및 이용에 동의합니다.</label>
                    <button
                        type="button"
                        onClick={() => setShowPrivacyTerms(prev => !prev)}
                        className="btn btn-link btn-sm ms-2"
                    >
                        [보기]
                    </button>
                    {showPrivacyTerms && (
                        <div className="mt-2 p-2 border" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            <SettingsPrivacyPolicyPage />
                        </div>
                    )}
                </div>

                <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="marketing" name="marketing_agreements" checked={form.marketing_agreements} onChange={handleChange} />
                    <label className="form-check-label" htmlFor="marketing">[선택] 마케팅 정보 수신에 동의합니다.</label>
                    <button
                        type="button"
                        onClick={() => setShowMarketingTerms(prev => !prev)}
                        className="btn btn-link btn-sm ms-2"
                    >
                        [보기]
                    </button>
                    {showMarketingTerms && (
                        <div className="mt-2 p-2 border" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            <ul><li>마케팅 약관은 추후 작성 예정</li></ul>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100">가입하기</button>
            </form>
        </div>
    );
}
