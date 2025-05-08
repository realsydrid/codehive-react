import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";

// const SERVER_URL = "http://localhost:8801"
const SERVER_URL = "";

export default function ExchangeRate() {
    return (
        <>
            <NewsNavBar />
            <NewsList title="금리/환율"
                      fetchUrl={`${SERVER_URL}/api/news?category=finance`}
                      />
        </>
    );
}