import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {GetPostLikeType, TogglePostLike} from "../CommunityUtil/CommunityToggleLike.js";

export function useGetPostLikeStatus(userNo, postNo) {
    return useQuery({
        queryKey: ["postLikeStatus", userNo, postNo],
        queryFn: async () => {
            const res = await GetPostLikeType(userNo, postNo);
            return res ?? { likeType: null }; // 기본값 지정
        },
        enabled: !!postNo && !!userNo,
        staleTime: 0,
    });
}

export function useTogglePostLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TogglePostLike,

        onMutate: async (variables) => {
            const { userNo, postNo, likeType: clickedType } = variables;

            await queryClient.cancelQueries(["postLikeStatus", userNo, postNo]);

            const previousLikeStatus = queryClient.getQueryData(["postLikeStatus", userNo, postNo]);
            const currentType = previousLikeStatus?.likeType;

            // 토글 처리
            let likeType = clickedType === currentType ? null : clickedType;

            // 선반영 상태 업데이트
            queryClient.setQueryData(["postLikeStatus", userNo, postNo], { likeType });

            // 게시글 목록 내 상태도 선반영
            queryClient.setQueryData(["post", postNo], (oldPosts) => {
                if (!oldPosts) return oldPosts;

                return oldPosts.map((pt) => {
                    if (pt.id !== postNo) return pt;

                    let newLikeCount = pt.likeCount;
                    let newDislikeCount = pt.dislikeCount;
                    const prev = pt.userLikeType;

                    // 선반영 계산
                    if (prev === likeType) {
                        // 같으면 토글 → 취소
                        if (likeType === 1) newLikeCount--;
                        if (likeType === 0) newDislikeCount--;
                        likeType = null;
                    } else {
                        if (likeType === 1) {
                            newLikeCount++;
                            if (prev === 0) newDislikeCount--;
                        } else if (likeType === 0) {
                            newDislikeCount++;
                            if (prev === 1) newLikeCount--;
                        }
                    }

                    return {
                        ...pt,
                        likeCount: newLikeCount,
                        dislikeCount: newDislikeCount,
                        userLikeType: likeType,
                    };
                });
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
            queryClient.setQueryData(["postLikeStatus", userNo, postNo], { likeType: data.likeType });
        },

        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries(["post", variables.postNo]);
        },
    });
}