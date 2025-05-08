import { useEffect, useState } from "react";
import "./CategoryNews.css";
import Swal from "sweetalert2";

export default function NewsList({ title, fetchUrl }) {
    const [newsList, setNewsList] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch(fetchUrl);
                const json = await res.json();
                setNewsList(json);
            } catch (error) {
                setError("뉴스를 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, [fetchUrl]);

    const handleNewsClick = async (e, url) => {
        e.preventDefault();
        const result = await Swal.fire({
            title: "클릭 시 기사 본문으로 이동합니다.",
            text: "계속 진행하시겠습니까?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#aaa",
            confirmButtonText: "이동",
            cancelButtonText: "취소"
        });

        if (result.isConfirmed) {
            window.open(url, "_blank", "noopener noreferrer");
        }
    };

    return (
        <div className="news-container">
            <h1 className="news-title">{title}</h1>
            {isLoading && <p className="loading-text">기사 불러오는 중...</p>}
            {error && <p className="error-text">{error}</p>}

            <ul className="news-list">
                {newsList.map((item, index) => (
                    <li key={index} className="news-item">
                        <a
                            href={item.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="news-link"
                            onClick={handleNewsClick}
                        >
                            {item.thumbnailUrl && (
                                <img
                                    src={item.thumbnailUrl}
                                    alt="뉴스 썸네일"
                                    className="news-thumbnail"
                                />
                            )}
                            <div className="news-text">
                                <h2>{item.title}</h2>
                                <p>{item.summary}</p>
                                <span className="news-date">
                                    {new Date(item.publishedAt).toLocaleString("ko-KR")}
                                </span>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}