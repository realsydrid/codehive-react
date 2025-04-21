import {useState} from "react";
import '../settings/SettingsTermsPage.css'

export default function SettingsTermsPage() {

    const [termsCategory, setTermsCategory] = useState("0")


    const handleTermsCategoryChange = (category) => {
        setTermsCategory(category)
    }
    const renderTabContent = () => {
        switch (termsCategory) {
            case "1":
                return <BitTerms/>
            case "2":
                return <OpenApiTerms/>
            case "3":
                return <NftTerms/>
        }
    }

    return (
        <>
            {termsCategory==="0" ? (
                <div>
                    <h1>이용약관</h1>
                    <ul className="terms-category-ul">
                        <li onClick={() => handleTermsCategoryChange("1")}>비트하이브 이용약관 보기</li>
                        <li onClick={() => handleTermsCategoryChange("2")}>Open API 이용약관 보기</li>
                        <li onClick={() => handleTermsCategoryChange("3")}>NFT 이용약관 보기</li>
                    </ul>
                </div>):(
                    <div>
                        {renderTabContent()}
                        <h2 onClick={()=> handleTermsCategoryChange("0")}>뒤로가기</h2>

                    </div>
            )


            }




        </>
    )
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
            </ul>

        </div>
    )
}