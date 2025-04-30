import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UseLoginUserContext } from "../provider/LoginUserProvider.jsx";
import SettingsPrivacyPolicyPage from "./settings/SettingsPrivacyPolicyPage.jsx"

export default function SignupPage() {
    const navigate = useNavigate();
    const [ , setLoginUser ] = useContext(UseLoginUserContext);
    const [showPrivacyTerms, setShowPrivacyTerms] = useState(false); // 약관 열기/닫기 상태 추가
    const [showMarketingTerms, setShowMarketingTerms] = useState(false); // (선택 약관도 열기/닫기)

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

    // 중복 체크 결과 저장할 상태
    const [checkResult, setCheckResult] = useState({
        userId: null,
        nickname: null,
        email: null
    });

    // 필드명을 사용자 친화적으로 바꿔주는 함수
    const getFieldLabel = (field) => {
        switch (field) {
            case "userId": return "아이디";
            case "nickname": return "닉네임";
            case "email": return "이메일";
            default: return field;
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: type === "checkbox" ? checked : value,
        }));

        // 입력할 때마다 중복 체크 결과 초기화
        if (["userId", "nickname", "email"].includes(name)) {
            setCheckResult((prev) => ({
                ...prev,
                [name]: null
            }));
        }
    };

    // 각 필드 중복 체크 함수
    const checkDuplicate = async (field) => {
        const value = form[field];
        if (!value) {
            alert(`${getFieldLabel(field)}를 입력해주세요.`);
            return;
        }

        let url;
        if (field === "userId") url = `http://localhost:8801/user/check-userid?userId=${value}`;
        else if (field === "nickname") url = `http://localhost:8801/user/check-nickname?nickname=${value}`;
        else if (field === "email") url = `http://localhost:8801/user/check-email?email=${value}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.exists) {
                alert(`이미 사용 중인 ${getFieldLabel(field)}입니다.`);
                setCheckResult(prev => ({ ...prev, [field]: false }));
            } else {
                alert(`사용 가능한 ${getFieldLabel(field)}입니다.`);
                setCheckResult(prev => ({ ...prev, [field]: true }));
            }
        } catch (err) {
            console.error(`${getFieldLabel(field)} 중복체크 실패`, err);
        }
    };

    // 회원가입 제출 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 약관 체크
        if (!form.privacyAgreements) {
            setError("개인정보 처리방침에 동의해야 가입할 수 있습니다.");
            return;
        }

        // 중복체크 통과 확인
        if (checkResult.userId !== true || checkResult.nickname !== true || checkResult.email !== true) {
            alert("아이디, 닉네임, 이메일 중복 확인을 해주세요.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8801/user/jwt/signup.do", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
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

    return (
        <div className="container" style={{ maxWidth: "500px", marginTop: "50px" }}>
            <h2 className="text-center mb-4">회원가입</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* 아이디 입력 + 중복확인 */}
                <div className="d-flex mb-3">
                    <input type="text" name="userId" placeholder="아이디 (이메일)" className="form-control mb-3" value={form.userId} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary ms-2" style={{ whiteSpace: "nowrap", height: "38px" }} onClick={() => checkDuplicate("userId")}>중복확인</button>
                </div>
                <input type="password" name="password" placeholder="비밀번호" className="form-control mb-3" value={form.password} onChange={handleChange} required />
                {/* 닉네임 입력 + 중복확인 */}
                <div className="d-flex mb-3">
                    <input type="text" name="nickname" placeholder="닉네임" className="form-control mb-3" value={form.nickname} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary ms-2" style={{ whiteSpace: "nowrap", height: "38px" }} onClick={() => checkDuplicate("nickname")}>중복확인</button>
                </div>
                {/* 이메일 입력 + 중복확인 */}
                <div className="d-flex mb-3">
                    <input type="email" name="email" placeholder="이메일" className="form-control mb-3" value={form.email} onChange={handleChange} required />
                    <button type="button" className="btn btn-outline-secondary ms-2" style={{ whiteSpace: "nowrap", height: "38px" }} onClick={() => checkDuplicate("email")}>중복확인</button>
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
                    <input type="checkbox" name="marketingAgreements" className="form-check-input" checked={form.marketingAgreements} onChange={handleChange} />
                    <label className="form-check-label">[선택] 마케팅 정보 수신에 동의합니다</label>
                    <button
                        type="button"
                        onClick={() => setShowMarketingTerms(prev => !prev)}
                        className="btn btn-link btn-sm ms-2"
                    >
                        [보기]
                    </button>
                    {showMarketingTerms && (
                        <div className="mt-2 p-2 border" style={{ maxHeight: "200px", overflowY: "auto" }}>
                            <li><strong>제1조 (목적)</strong><br/>이 약관은 회사가 회원에게 제공하는 마케팅 정보 수신 관련 사항을 규정합니다.</li>
                            <li><strong>제2조 (수신 항목)</strong><br/>이메일, 문자메시지(SMS), 앱 알림(Push Notification)을 통해 혜택 및 이벤트 정보가 제공됩니다.
                            </li>
                            <li><strong>제3조 (활용 목적)</strong><br/>신상품 안내, 할인 이벤트, 고객 맞춤형 서비스 및 기타 프로모션 정보 제공에 활용됩니다.</li>
                            <li><strong>제4조 (수신 동의 철회)</strong><br/>회원은 언제든지 마케팅 정보 수신을 거부하거나 동의를 철회할 수 있으며, 설정 화면 또는 고객센터를 통해 처리할 수
                                있습니다.
                            </li>
                            <li><strong>제5조 (정보 보유 및 이용 기간)</strong><br/>회원의 동의가 철회되기 전까지 보관 및 이용하며, 철회 시 즉시 삭제됩니다.</li>
                            <li><strong>제6조 (개인정보 제공 동의)</strong><br/>마케팅 정보 발송을 위해 위탁업체에 개인정보가 제공될 수 있으며, 이는 개인정보 처리방침에 따릅니다.</li>
                            <li><strong>제7조 (유의사항)</strong><br/>마케팅 수신 동의는 서비스 이용과 무관하며, 수신 거부 시에도 기본 서비스 이용은 가능합니다.</li>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100">가입하기</button>
            </form>
        </div>
    );
}