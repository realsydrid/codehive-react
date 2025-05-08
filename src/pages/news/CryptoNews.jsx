import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";
import {SERVER_URL} from "./Api.js.jsx";


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