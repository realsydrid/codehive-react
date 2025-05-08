import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";

// const SERVER_URL = "http://localhost:8801"
const SERVER_URL = "";

export default function CryptoNews() {
    return (
        <>
            <NewsNavBar />
            <NewsList title="암호화폐 뉴스"
                      fetchUrl={`${SERVER_URL}/api/news?category=crypto`}
                      />
        </>
    );
}