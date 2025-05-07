import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {GetCommentLikeType, ToggleCommentLike} from "../CommunityUtil/CommunityToggleLike.js";
import context from "react-bootstrap/NavbarContext";
import {useContext, useEffect, useState} from "react";
import {UseLoginUserContext} from "../../../provider/LoginUserProvider.jsx";

// ✅ 댓글 전체 + 유저 상태 받아서, 특정 댓글 상태만 추출
// 좋아요/싫어요 상태 가져오기
export function useGetCommentLikeStatus(userNo, commentNo, postNo) {
    const [loginUser,]=useContext(UseLoginUserContext)
    const [isLoadingUser, setIsLoadingUser] = useState(true); // 로그인 상태 로딩 상태
    useEffect(() => {
        if (loginUser !== null) {
            setIsLoadingUser(false); // 로그인 정보가 로딩되면 지연 렌더링 해제
        }
    }, [loginUser]);
    return useQuery({
        queryKey: ["commentLikeStatus", Number(userNo), Number(commentNo)],
        queryFn: async () => {
            const data = await GetCommentLikeType(Number(postNo));
            const target = data.find(comment => comment.dto.id === Number(commentNo));
            return {
                userLikeType: target?.userLikeType ?? null,
            };
        },
        staleTime:0,
        enabled: !!userNo && !!commentNo && !!postNo && !isLoadingUser,
    });
}

export function useToggleCommentLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ToggleCommentLike,

        onMutate: async (variables) => {
            const { userNo, commentNo, postNo, likeType } = variables;

            const uNo = Number(userNo);
            const cNo = Number(commentNo);
            const pNo = Number(postNo);

            await queryClient.cancelQueries(["commentLikeStatus", uNo, cNo]);
            await queryClient.cancelQueries(["commentDto", pNo]);

            const previousStatus = queryClient.getQueryData(["commentLikeStatus", uNo, cNo]);
            const previousComments = queryClient.getQueryData(["commentDto", pNo]);

            queryClient.setQueryData(["commentLikeStatus", uNo, cNo], { userLikeType: likeType });

            queryClient.setQueryData(["commentDto", pNo], (oldComments) => {
                if (!oldComments) return oldComments;

                return oldComments.map((comment) => {
                    const dto = comment.dto;
                    if (dto.commentNo !== cNo) return comment;

                    const prevType = comment.userLikeType ?? null;
                    let likeCount = dto.likeCount;
                    let dislikeCount = dto.dislikeCount;

                    if (prevType === true && likeType !== true) likeCount--;
                    if (prevType === false && likeType !== false) dislikeCount--;

                    if (likeType === true && prevType !== true) likeCount++;
                    if (likeType === false && prevType !== false) dislikeCount++;

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
            queryClient.setQueryData(["commentLikeStatus", Number(userNo), Number(commentNo)], {
                userLikeType: data?.likeType ?? null,
            });
        },

        onError: (_err, variables, context) => {
            const { userNo, commentNo, postNo } = variables;
            const uNo = Number(userNo);
            const cNo = Number(commentNo);
            const pNo = Number(postNo);

            if (context?.previousStatus) {
                queryClient.setQueryData(["commentLikeStatus", uNo, cNo], context.previousStatus);
            }
            if (context?.previousComments) {
                queryClient.setQueryData(["commentDto", pNo], context.previousComments);
            }
        },

        onSettled: (_data, _error, variables) => {
            const { userNo, commentNo, postNo } = variables;
            const uNo = Number(userNo);
            const cNo = Number(commentNo);
            const pNo = Number(postNo);

            queryClient.invalidateQueries(["commentLikeStatus", uNo, cNo]);
            queryClient.invalidateQueries(["commentDto", pNo]);
        }
    });
}