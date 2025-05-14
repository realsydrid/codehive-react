import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ToggleCommentLike} from "../CommunityUtil/CommunityToggleLike.js";

export function useToggleCommentLike(commentNo, postNo) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userLikeType) => ToggleCommentLike(commentNo, userLikeType),
        onMutate: async (newLikeType) => {
            await queryClient.cancelQueries(["commentDto", postNo]);
            const previousComments = queryClient.getQueryData(["commentDto", postNo]);

            queryClient.setQueryData(["commentDto", postNo], (old) =>
                old?.map((comment) => {
                    if (comment.id !== commentNo) {
                        // ❗ 이것도 얕은 비교 회피하려면 새 객체로 리턴
                        return { ...comment };
                    }

                    let newLikeCount = comment.likeCount;
                    let newDislikeCount = comment.dislikeCount;

                    if (comment.likeType === true) newLikeCount--;
                    if (comment.likeType === false) newDislikeCount--;

                    if (newLikeType === true) newLikeCount++;
                    if (newLikeType === false) newDislikeCount++;

                    return {
                        ...comment,
                        likeType: newLikeType,
                        likeCount: newLikeCount,
                        dislikeCount: newDislikeCount,
                    };
                })
            );

            return { previousComments };
        },
        onError: (err, newLikeType, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(["commentDto", postNo], context.previousComments);
            }
        },
        onSuccess: () => {
            // 최종 동기화
            queryClient.invalidateQueries(["commentDto", postNo]);
        },
    });
}
