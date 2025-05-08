import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UseLoginUserContext } from "../provider/LoginUserProvider.jsx";
import SettingsPrivacyPolicyPage from "./settings/SettingsPrivacyPolicyPage.jsx";

export default function SignupPage() {
    const ServerUrl = "";
    // const ServerUrl = "http://localhost:8801"
    const navigate = useNavigate();
    const [, setLoginUser] = useContext(UseLoginUserContext);
    const [showPrivacyTerms, setShowPrivacyTerms] = useState(false);
    const [showMarketingTerms, setShowMarketingTerms] = useState(false);

    const [form, setForm] = useState({
        userId: "",
        password: "",
        nickname: "",
        email: "",
        privacyAgreements: false,
        marketingAgreements: false,
        gender: "",
        birthDate: "",
        name: ""
    });

    const [error, setError] = useState("");
    const [checkResult, setCheckResult] = useState({
        userId: null,
        nickname: null,
        email: null
    });

    const getFieldLabel = (field) => {
        switch (field) {
            case "userId": return "아이디";
            case "nickname": return "닉네임";
            case "email": return "이메일";
            case "password": return "비밀번호";
            default: return field;
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: type === "checkbox" ? checked : value
        }));

        if (["userId", "nickname", "email"].includes(name)) {
            setCheckResult((prev) => ({ ...prev, [name]: null }));
        }
    };

    const checkDuplicate = async (field) => {
        const value = form[field];

        if (!value) return;

        // 유효성 조건 검사
        if (field === "userId" && (value.length < 4 || value.length > 12)) return;
        if (field === "nickname" && (value.length < 2 || value.length > 8)) return;
        if (field === "password" && (value.length < 4 || value.length > 12)) return;

        let url;
        if (field === "userId") url = `${ServerUrl}/user/check-userid?userId=${value}`;
        else if (field === "nickname") url = `${ServerUrl}/user/check-nickname?nickname=${value}`;
        else if (field === "email") url = `${ServerUrl}/user/check-email?email=${value}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setCheckResult(prev => ({ ...prev, [field]: !data.exists }));
        } catch (err) {
            console.error(`${getFieldLabel(field)} 중복체크 실패`, err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const today = new Date().toISOString().split("T")[0];
        if (form.birthDate > today) {
            setError("생년월일이 잘못되었습니다.");
            return;
        }

        if (!form.privacyAgreements) {
            setError("개인정보 처리방침에 동의해야 가입할 수 있습니다.");
            return;
        }

        if (
            form.userId.length < 4 || form.userId.length > 12 ||
            form.password.length < 4 || form.password.length > 12 ||
            form.nickname.length < 2 || form.nickname.length > 8
        ) {
            setError("입력 조건을 만족하지 않습니다.");
            return;
        }

        if (checkResult.userId !== true || checkResult.nickname !== true || checkResult.email !== true) {
            setError("아이디, 닉네임, 이메일 중복 확인을 해주세요.");
            return;
        }

        try {
            const response = await fetch(`${ServerUrl}/user/jwt/signup.do`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.message || "회원가입 실패");
                return;
            }

            const { jwt, user: userData } = await response.json();
            localStorage.setItem("jwt", jwt);
            setLoginUser(userData);
            navigate("/");
        } catch (err) {
            console.error("회원가입 에러:", err);
            setError("서버 오류가 발생했습니다.");
        }
    };

    const renderValidationText = (field) => {
        const value = form[field];
        if (value === "") return null;

        if (field === "userId" && (value.length < 4 || value.length > 12)) return <div className="text-danger small">아이디는 4~12자여야 합니다.</div>;
        if (field === "password" && (value.length < 4 || value.length > 12)) return <div className="text-danger small">비밀번호는 4~12자여야 합니다.</div>;
        if (field === "nickname" && (value.length < 2 || value.length > 8)) return <div className="text-danger small">닉네임은 2~8자여야 합니다.</div>;

        if (checkResult[field] === true) return <div className="text-success small">사용 가능한 {getFieldLabel(field)}입니다.</div>;
        if (checkResult[field] === false) return <div className="text-danger small">이미 사용 중인 {getFieldLabel(field)}입니다.</div>;
        return null;
    };

    return (
        <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
            <h2 className="text-center mb-4">회원가입</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-1">
                    <div className="d-flex">
                        <input type="text" name="userId" placeholder="아이디" className="form-control mb-1" value={form.userId} onChange={handleChange} required />
                        <button type="button" className="btn btn-outline-secondary ms-2" style={{ whiteSpace: "nowrap", height: "38px", minWidth: "80px" }} onClick={() => checkDuplicate("userId")}>중복확인</button>
                    </div>
                    {renderValidationText("userId")}
                </div>

                <div className="mb-1">
                    <input type="password" name="password" placeholder="비밀번호" className="form-control mb-1" value={form.password} onChange={handleChange} required />
                    {renderValidationText("password")}
                </div>

                <div className="mb-1">
                    <div className="d-flex">
                        <input type="text" name="nickname" placeholder="닉네임" className="form-control mb-1" value={form.nickname} onChange={handleChange} required />
                        <button type="button" className="btn btn-outline-secondary ms-2" style={{ whiteSpace: "nowrap", height: "38px", minWidth: "80px" }} onClick={() => checkDuplicate("nickname")}>중복확인</button>
                    </div>
                    {renderValidationText("nickname")}
                </div>

                <div className="mb-1">
                    <div className="d-flex">
                        <input type="email" name="email" placeholder="이메일" className="form-control mb-1" value={form.email} onChange={handleChange} required />
                        <button type="button" className="btn btn-outline-secondary ms-2" style={{ whiteSpace: "nowrap", height: "38px", minWidth: "80px" }} onClick={() => checkDuplicate("email")}>중복확인</button>
                    </div>
                    {renderValidationText("email")}
                </div>

                <input type="text" name="name" placeholder="이름" className="form-control mb-3" value={form.name} onChange={handleChange} required />
                <label className="form-label">생년월일</label>
                <input type="date" name="birthDate" className="form-control mb-3" value={form.birthDate} onChange={handleChange} required />

                <select name="gender" className="form-control mb-3" value={form.gender} onChange={handleChange} required>
                    <option value="">성별 선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                </select>

                <div className="form-check mb-2">
                    <input type="checkbox" name="privacyAgreements" className="form-check-input" checked={form.privacyAgreements} onChange={handleChange} />
                    <label className="form-check-label">[필수] 개인정보 이용에 동의합니다</label>
                    <button type="button" onClick={() => setShowPrivacyTerms(prev => !prev)} className="btn btn-link btn-sm ms-2">[보기]</button>
                    {showPrivacyTerms && (
                        <div className="mt-2 p-2 border" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            <SettingsPrivacyPolicyPage />
                        </div>
                    )}
                </div>

                <div className="form-check mb-4">
                    <input type="checkbox" name="marketingAgreements" className="form-check-input" checked={form.marketingAgreements} onChange={handleChange} />
                    <label className="form-check-label">[선택] 마케팅 정보 수신에 동의합니다</label>
                    <button type="button" onClick={() => setShowMarketingTerms(prev => !prev)} className="btn btn-link btn-sm ms-2">[보기]</button>
                    {showMarketingTerms && (
                        <div className="mt-2 p-2 border" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            <ul><li>추후 작성 예정</li></ul>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100">가입하기</button>
            </form>
        </div>
    );
}
