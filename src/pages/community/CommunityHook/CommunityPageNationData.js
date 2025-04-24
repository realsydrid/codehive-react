import {useEffect, useState} from "react";
import {GetPosts} from "../CommunityUtil/CommunityFetch.js";


export default function CommunityPageNationData(category){
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [size,setSize]=useState(10)
    const fetchPosts = async () => {
        if (isLoading) return; // 중복 방지
        setIsLoading(true);
        try {
            const data = await GetPosts(category,page,size);
            setPosts(prev => [...prev, ...data.content]);
            setHasMore(!data.last);
            setPage(prev => prev + 1); // 다음 페이지 준비!
            setSize(size)
        } catch (e) {
            console.error(e);
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchPosts();
    },[]);

    return {data:posts, fetchPosts, isLoading, isError, hasMore };
}