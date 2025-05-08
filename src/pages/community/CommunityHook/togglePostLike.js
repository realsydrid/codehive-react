import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPostLikeType, TogglePostLike } from "../CommunityUtil/CommunityToggleLike.js";
import {useContext, useEffect, useState} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";

// 좋아요 상태 조회 훅
export function useGetPostLikeStatus(userNo, postNo) {
    const [loginUser,]=useContext(UseLoginUserContext)
    const [isLoadingUser, setIsLoadingUser] = useState(true); // 로그인 상태 로딩 상태
    useEffect(() => {
        if (loginUser !== null) {
            setIsLoadingUser(false); // 로그인 정보가 로딩되면 지연 렌더링 해제
        }
    }, [loginUser]);
    return useQuery({
        queryKey: ["postLikeStatus", userNo, postNo],
        queryFn: async () => {
            const res = await GetPostLikeType(userNo, postNo);
            return res ?? {userNo:userNo,postNo:postNo, likeType: null };
        },
        enabled: !!userNo && !!postNo && !isLoadingUser,
        staleTime: 0,
    });
}

// 토글 훅
export function useTogglePostLike(category) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TogglePostLike,

        onMutate: async (variables) => {
            const { userNo, postNo, likeType: clickedType } = variables;

            await queryClient.cancelQueries(["postLikeStatus", userNo, postNo]);

            const previousLikeStatus = queryClient.getQueryData(["postLikeStatus", userNo, postNo]);
            const currentType = previousLikeStatus?.likeType;

            let newType = clickedType === currentType ? null : clickedType;

            // 상태 선반영 (postLikeStatus)
            queryClient.setQueryData(["postLikeStatus", userNo, postNo], {
                userNo,
                postNo,
                likeType: newType,
            });

            // 상세 페이지용 캐시 업데이트
            queryClient.setQueryData(["post", postNo], (oldPost) => {
                if (!oldPost) return oldPost;

                let { likeCount, dislikeCount, userLikeType } = oldPost;

                if (userLikeType === newType) {
                    if (newType === 1) likeCount--;
                    if (newType === 0) dislikeCount--;
                    newType = null;
                } else {
                    if (newType === 1) {
                        likeCount++;
                        if (userLikeType === 0) dislikeCount--;
                    } else if (newType === 0) {
                        dislikeCount++;
                        if (userLikeType === 1) likeCount--;
                    }
                }

                return {
                    ...oldPost,
                    likeCount,
                    dislikeCount,
                    userLikeType: newType,
                };
            });

            // 목록 페이지용 캐시 업데이트 (InfiniteQuery 구조)
            queryClient.setQueryData(["posts", category], (oldData) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    pages: oldData.pages.map((page) => ({
                        ...page,
                        content: page.content.map((pt) => {
                            if (pt.id !== postNo) return pt;

                            let { likeCount, dislikeCount, userLikeType } = pt;

                            if (userLikeType === newType) {
                                if (newType === 1) likeCount--;
                                if (newType === 0) dislikeCount--;
                                newType = null;
                            } else {
                                if (newType === 1) {
                                    likeCount++;
                                    if (userLikeType === 0) dislikeCount--;
                                } else if (newType === 0) {
                                    dislikeCount++;
                                    if (userLikeType === 1) likeCount--;
                                }
                            }

                            return {
                                ...pt,
                                likeCount,
                                dislikeCount,
                                userLikeType: newType,
                            };
                        }),
                    })),
                };
            });

            return { previousLikeStatus };
        },

        onError: (_err, variables, context) => {
            const { userNo, postNo } = variables;
            if (context?.previousLikeStatus) {
                queryClient.setQueryData(["postLikeStatus", userNo, postNo], context.previousLikeStatus);
            }
        },

        onSuccess: (data, variables) => {
            const { userNo, postNo } = variables;
            // 서버에서 likeType 외에도 전체 객체 반환 시 이렇게 설정
            queryClient.setQueryData(["postLikeStatus", userNo, postNo], {
                userNo,
                postNo,
                likeType: data.likeType,
            });
        },

        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries(["postLikeStatus", variables.userNo, variables.postNo]);
        },
    });
}
