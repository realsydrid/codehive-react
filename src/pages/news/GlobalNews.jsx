import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";

// const SERVER_URL = "http://localhost:8801"
const SERVER_URL = "";

export default function GlobalNews() {
    return (
        <>
            <NewsNavBar />
            <NewsList title="글로벌 증시"
                      fetchUrl={`${SERVER_URL}/api/news?category=global`}
                      />
        </>
    );
}