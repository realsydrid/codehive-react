import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";

export default function ExchangeRate() {
    return (
        <>
            <NewsNavBar />
            <NewsList title="금리/환율"
                      fetchUrl="http://localhost:8801/api/news/finance"
                      />
        </>
    );
}