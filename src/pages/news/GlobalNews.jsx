import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";

export default function GlobalNews() {
    return (
        <>
            <NewsNavBar />
            <NewsList title="글로벌 증시"
                      fetchUrl="http://localhost:8801/api/news?category=global"
                      />
        </>
    );
}