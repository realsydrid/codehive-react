import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPostLikeType, TogglePostLike } from "../CommunityUtil/CommunityToggleLike.js";
import {useContext, useEffect, useState} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";

// 좋아요 상태 조회 훅
export function useGetPostLikeStatus(postNo) {

    return useQuery({
        queryKey: ["postLikeStatus", postNo], // userNo 제거 -> 프론트 선반영 -> 서버반영 선반영
        queryFn: ()=> GetPostLikeType(postNo),
        enabled: typeof postNo === "number" && postNo > 0,
        staleTime: 18000, //쿼리 캐시 갱신전 30초 유지
    });
}
// useTogglePostLike -> 토글시 작동 되는 훅
export function useTogglePostLike(postNo) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userLikeType)=>TogglePostLike(postNo,userLikeType),

        onMutate: async (variables) => {
            const { postNo, userLikeType: clickedType } = variables;

            await queryClient.cancelQueries(["postLikeStatus", Number(postNo)]);
            const previousLikeStatus = queryClient.getQueryData(["postLikeStatus", Number(postNo)]);
            const currentType = previousLikeStatus?.userLikeType;

            // 토글 상태 계산 (local 변수)
            let newType = clickedType === currentType ? null : clickedType;

            // 상태 선반영 (postLikeStatus)
            queryClient.setQueryData(["postLikeStatus", Number(postNo)], {
                userLikeType: newType,
            });

            // 상세 페이지용 캐시 업데이트
            queryClient.setQueryData(["post", Number(postNo)], (oldPost) => {
                if (!oldPost) return oldPost;

                let { likeCount, dislikeCount, userLikeType } = oldPost;

                // likeCount, dislikeCount 계산은 newType 재할당 없이 지역변수로 처리
                if (userLikeType === newType) {
                    if (newType === 1) likeCount--;
                    if (newType === 0) dislikeCount--;
                    newType = null; // 여기는 재할당 하지 말고 별도 변수로 관리 추천
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
            //게시글 목록을 초기화 하려 했으나, 게시글 카테고리를 쿼리키로 갖는 인수를 받을 곳이 없었음
            queryClient.setQueryData(["post", Number(postNo)], (oldData) => {
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
                                newType = null; // 재할당 주의
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
            const { postNo } = variables;
            if (context?.previousLikeStatus) {
                queryClient.setQueryData(["postLikeStatus", Number(postNo)], context.previousLikeStatus);
            }
        },

        onSuccess: (data, variables) => {
            const { postNo } = variables;
            // 서버에서 likeType 외에도 전체 객체 반환 시 이렇게 설정
            queryClient.setQueryData(["postLikeStatus", Number(postNo)], {
                userLikeType: data.userLikeType,
            });
        },

        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries(["postLikeStatus", Number(variables.postNo)]);
        },
    });
}
