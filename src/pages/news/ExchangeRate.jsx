import NewsNavBar from "./NewsNavBar.jsx";
import "./CategoryNews.css";
import NewsList from "./NewsList.jsx";
import {SERVER_URL} from "./Api.js.jsx";


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