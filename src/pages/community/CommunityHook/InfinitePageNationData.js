import {GetPosts} from "../CommunityUtil/CommunityPostFetch.js";
import {useInfiniteQuery} from "@tanstack/react-query";


export default function InfinitePageNationData(category,size=10){
    return useInfiniteQuery({
        queryKey: ['posts', category],
        queryFn: async ({ pageParam = 0 }) => GetPosts(category, pageParam,size),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.last ? undefined : allPages.length;
        },
        initialPageParam: 0,
    });
}