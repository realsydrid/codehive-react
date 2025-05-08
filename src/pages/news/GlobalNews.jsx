import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";
import {SERVER_URL} from "./Api.js.jsx";

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