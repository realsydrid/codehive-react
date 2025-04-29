import { useState } from "react";
import '../settings/SettingsTermsPage.css';

export default function SettingsTermsPage() {
    const [termsCategory, setTermsCategory] = useState("0");
    const [marketingChecked, setMarketingChecked] = useState(false);

    const handleTermsCategoryChange = (category) => {
        setTermsCategory(category);
    };

    const renderTabContent = () => {
        switch (termsCategory) {
            case "1":
                return <BitTerms />;
            case "2":
                return <OpenApiTerms />;
            case "3":
                return <NftTerms />;
            case "4":
                return <MarketingTerms />;
        }
    };

    return (
        <>
            {termsCategory === "0" ? (
                <div className="terms-container">
                    <h1 className="terms-title">서비스 이용약관</h1>

                    <h2 className="terms-category-title">필수 이용동의</h2>
                    <ul className="terms-category-ul">
                        <li onClick={() => handleTermsCategoryChange("1")}>비트하이브 이용약관</li>
                        <li onClick={() => handleTermsCategoryChange("2")}>Open API 이용약관</li>
                        <li onClick={() => handleTermsCategoryChange("3")}>NFT 이용약관</li>
                    </ul>

                    <h2 className="terms-category-title">선택 이용동의</h2>
                    <ul className="terms-category-ul">
                        <li
                            className="terms-checkbox-item"
                            onClick={() => handleTermsCategoryChange("4")}
                        >
                            <input
                                type="checkbox"
                                id="marketingConsent"
                                checked={marketingChecked}
                                onChange={(e) => setMarketingChecked(e.target.checked)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            <label htmlFor="marketingConsent" className="terms-checkbox-label">
                                마케팅 수신동의사항
                            </label>
                        </li>
                    </ul>
                </div>
            ) : (
                <div className="terms-container">
                    <div className="terms-box">
                        {renderTabContent()}
                    </div>
                    <h2 onClick={() => handleTermsCategoryChange("0")}>뒤로가기</h2>
                </div>
            )}
        </>
    );
}
function BitTerms(){
    return(
        <div>
            <h2>비트 하이브 이용 약관</h2>
            <ul>
                <li><strong>제1조 (목적)</strong><br/>비트하이브 플랫폼을 이용하는 회원과 회사 간의 권리 및 의무를 정의합니다.</li>
                <li><strong>제2조 (정의)</strong><br/>디지털 자산 및 관련 용어를 정의합니다.</li>
                <li><strong>제3조 (회원의 의무)</strong><br/>회원은 관련 법령 및 본 약관을 준수해야 합니다.</li>
                <li><strong>제4조 (서비스 이용)</strong><br/>서비스는 안정적으로 제공되며, 사전 안내 후 중단될 수 있습니다.</li>
                <li><strong>제5조 (책임 제한)</strong><br/>회사는 불가항력이나 회원의 과실에 대한 책임을 지지 않습니다.</li>
                <li><strong>제6조 (서비스 제공)</strong><br />회사는 연중무휴, 1일 24시간 서비스를 제공합니다. 단, 정기점검 또는 시스템 장애 발생 시 예외로 합니다.</li>
                <li><strong>제7조 (회원의 의무)</strong><br />회원은 관련 법령 및 회사의 이용약관을 준수하며, 타인의 권리를 침해하거나 서비스를 악용하지 않아야 합니다.</li>
                <li><strong>제8조 (금지 행위)</strong><br />타인의 정보 도용, 시스템 해킹 시도, 비정상적인 거래 시도 등은 금지되며, 적발 시 이용제한 또는 법적 조치가 취해질 수 있습니다.</li>
                <li><strong>제9조 (서비스의 변경 및 중단)</strong><br />회사는 서비스의 전부 또는 일부를 사전 공지 후 변경 또는 중단할 수 있습니다.</li>
                <li><strong>제10조 (책임 제한)</strong><br />회사는 천재지변, 불가항력, 회원의 귀책 사유 등으로 발생한 손해에 대해 책임을 지지 않습니다.</li>
            </ul>

        </div>
    )
}

function OpenApiTerms() {
    return (
        <div>
            <h2>Open Api 이용 양관</h2>
            <ul>
                <li><strong>제1조 (목적)</strong><br/>Open API 연동 조건 및 책임 범위를 정의합니다.</li>
                <li><strong>제2조 (정의)</strong><br/>Open API는 시세 조회, 주문 등 기능을 제공합니다.</li>
                <li><strong>제3조 (면책사항)</strong><br/>API 사용 중 발생하는 손해에 대한 책임은 사용자에게 있습니다.</li>
                <li><strong>제4조 (사용자 의무)</strong><br/>API 키 관리, 정책 준수 등 사용자 의무가 명시됩니다.</li>
                <li><strong>제5조 (약관 변경)</strong><br/>변경 사항은 사전 공지되며 동의하지 않을 시 해지가 가능합니다.</li>
                <li><strong>제6조 (API 사용의 중지)</strong><br />사용자가 약관을 위반하거나 서비스에 악영향을 줄 경우, 회사는 API 이용을 일시적 또는 영구적으로 제한할 수 있습니다.</li>
                <li><strong>제7조 (저작권 및 데이터 활용)</strong><br />API 데이터를 무단 수집·재배포하는 행위는 금지됩니다.</li>
                <li><strong>제8조 (면책조항)</strong><br />API 사용 중 발생하는 오류, 손해 등에 대해 회사는 일체 책임을 지지 않습니다.</li>
                <li><strong>제9조 (약관 변경)</strong><br />본 약관은 사전 고지를 통해 변경될 수 있으며, 사용자는 변경 약관에 동의하지 않을 경우 이용을 중단해야 합니다.</li>
            </ul>

        </div>
    )
}
function NftTerms() {
    return(
        <div>
            <h2>NFT 이용 약관</h2>
            <ul>
                <li><strong>제1조 (목적)</strong><br/>NFT 거래 시 회사와 회원 간의 권리와 의무를 규정합니다.</li>
                <li><strong>제2조 (정의)</strong><br/>NFT는 디지털 자산이며 디지털 저작물과 연동됩니다.</li>
                <li><strong>제3조 (보유자의 권리)</strong><br/>보유자는 NFT 권리를 행사할 수 있으며 저작권은 포함되지 않습니다.</li>
                <li><strong>제4조 (서비스 제한)</strong><br/>문제 발생 시 거래 제한 및 종료가 가능합니다.</li>
                <li><strong>제5조 (금지 행위)</strong><br/>불법 복제나 가격 조작 등 행위는 금지됩니다.</li>
                <li><strong>제6조 (금지 행위)</strong><br />불법복제, 허위정보 등록, 시세 조작 등 부정한 행위는 금지되며, 적발 시 계정 정지 또는 민형사 책임이 따릅니다.</li>
                <li><strong>제7조 (서비스의 제한 및 중단)</strong><br />NFT 서비스는 시스템 점검, 법령 변경 등으로 제한될 수 있습니다.</li>
                <li><strong>제8조 (수수료 및 세금)</strong><br />NFT 거래 시 발생하는 수수료 및 관련 세금은 회원 본인의 부담입니다.</li>
                <li><strong>제9조 (책임의 한계)</strong><br />NFT의 가치 변동, 기술적 오류 등에 대해 회사는 책임을 지지 않습니다.</li>
                <li><strong>제10조 (분쟁 해결)</strong><br />회사와 회원 간 발생하는 분쟁은 상호 협의를 통해 해결하며, 불가할 경우 관할 법원에 제소할 수 있습니다.</li>
            </ul>

        </div>
    )
}

function MarketingTerms() {
    return(
        <div>
            <h2>마케팅 수신 동의 이용 약관</h2>
            <ul>
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
            </ul>

        </div>
    )
}