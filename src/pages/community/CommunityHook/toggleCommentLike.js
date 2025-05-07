import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {GetCommentLikeType, ToggleCommentLike} from "../CommunityUtil/CommunityToggleLike.js";
import context from "react-bootstrap/NavbarContext";

// ✅ 댓글 전체 + 유저 상태 받아서, 특정 댓글 상태만 추출
export function useGetCommentLikeStatus(userNo, commentNo, postNo) {
    return useQuery({
        queryKey: ["commentLikeStatus", userNo, commentNo],
        queryFn: async () => {
            const data = await GetCommentLikeType(postNo, userNo); // 순서 바뀜 주의!
            const target = data.find(comment => comment.dto.commentId === commentNo);
            return {
                likeType: target?.userLikeType ?? null,
            };
        },
        staleTime: 1000, // optional: 캐싱 시간
        enabled: !!userNo && !!commentNo,
    });
}

export function useToggleCommentLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ToggleCommentLike,

        onMutate: async (variables) => {
            const { userNo, commentNo, likeType, postNo } = variables;

            await queryClient.cancelQueries(["commentLikeStatus", userNo, commentNo]);
            await queryClient.cancelQueries(["commentDto", postNo]);

            const previousStatus = queryClient.getQueryData(["commentLikeStatus", userNo, commentNo]);
            const previousComments = queryClient.getQueryData(["commentDto", postNo]);

            queryClient.setQueryData(["commentLikeStatus", userNo, commentNo], { likeType });

            queryClient.setQueryData(["commentDto", postNo], (oldComments) => {
                if (!oldComments) return oldComments;

                return oldComments.map((comment) => {
                    const dto = comment.dto;
                    if (dto.commentId !== commentNo) return comment;

                    const prevType = comment.userLikeType;
                    let likeCount = dto.likeCount;
                    let dislikeCount = dto.dislikeCount;

                    // 선반영 계산
                    if (prevType === true && likeType !== true) likeCount--;
                    if (prevType === false && likeType !== false) dislikeCount--;

                    if (likeType === true) likeCount++;
                    if (likeType === false) dislikeCount++;

                    return {
                        ...comment,
                        dto: {
                            ...dto,
                            likeCount,
                            dislikeCount,
                        },
                        userLikeType: likeType,
                    };
                });
            });

            return { previousStatus, previousComments };
        },

        onSuccess: (data, variables) => {
            const { userNo, commentNo } = variables;

            queryClient.setQueryData(["commentLikeStatus", userNo, commentNo], {
                likeType: data?.likeType ?? null,
            });
        },

        onError: (_err, variables, context) => {
            const { userNo, commentNo, postNo } = variables;
            if (context?.previousStatus) {
                queryClient.setQueryData(["commentLikeStatus", userNo, commentNo], context.previousStatus);
            }
            if (context?.previousComments) {
                queryClient.setQueryData(["commentDto", postNo], context.previousComments);
            }
        },

        onSettled: (_data, _error, variables) => {
            const { userNo, commentNo, postNo } = variables;
            queryClient.invalidateQueries(["commentLikeStatus", userNo, commentNo]);
            queryClient.invalidateQueries(["commentDto", postNo]);
        }
    });
}