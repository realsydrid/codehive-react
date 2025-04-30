import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";

export default function CryptoNews() {
    return (
        <>
            <NewsNavBar />
            <NewsList title="암호화폐 뉴스"
                      fetchUrl="http://localhost:8801/api/news/crypto"
                      />
        </>
    );
}