import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {GetCommentLikeType, ToggleCommentLike} from "../CommunityUtil/CommunityToggleLike.js";

export function useGetCommentLikeStatus(userNo, commentNo) {
    return useQuery({
        queryKey: ["commentLikeStatus", userNo, commentNo],
        queryFn: () => GetCommentLikeType(userNo, commentNo),
        staleTime: 1,
        enabled: !!userNo && !!commentNo, // 둘 다 있을 때만 요청
    });
}
// 좋아요/싫어요 구현시 Optimistic Update 구조를 사용,
// 이 구조는 UI 선반영 구조임 여기서는 useMutation과 QueryClient를 사용함
// 이 구조가 돌아가는 알고리즘은 일단 사용자의 UI에 결과값을 출력하면서 서버로 데이터로 전송함
// 실패시 롤백하고 성공하면 그대로 반영됨 그래서 순서 또한 useMutation을 쓰면서 함수를 불러오면서
// 기존에 있던 쿼리키를 없애고 새로운 쿼리키 데이터를 반영 시킨다(onMutate)
// 이게 먼저 사용자의 UI에 반영됨 -> 다음에 에러를 검증한다(onError)
// 성공하면(onSuccess) 실제 데이터베이스에 갱신됨
// 다음 결과를 호출하고 결과를 반영한다(onSettled)
// -> 왜 쓰게 되었나? 상대적으로 통신속도가 느린 환경에서 사용자에게 편안한 사용경험을 제공함
export function useToggleCommentLike() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ToggleCommentLike,

        onMutate: async (variables) => {
            const { userNo, commentNo, likeType, postNo } = variables;

            // 기존 쿼리 취소
            await queryClient.cancelQueries(["commentLikeStatus", userNo, commentNo]);
            await queryClient.cancelQueries(["commentDto", postNo]);

            // 기존 데이터 백업
            const previousStatus = queryClient.getQueryData(["commentLikeStatus", userNo, commentNo]);
            const previousComments = queryClient.getQueryData(["commentDto", postNo]);

            // 즉시 반영: commentLikeStatus (개별 상태)
            queryClient.setQueryData(["commentLikeStatus", userNo, commentNo], { likeType });

            // 즉시 반영: commentDto (댓글 목록)
            queryClient.setQueryData(["commentDto", postNo], (oldComments) => {
                if (!oldComments) return oldComments;

                return oldComments.map((cmt) => {
                    if (cmt.id !== commentNo) return cmt;

                    const prevType = cmt.userLikeType;
                    let newLikeCount = cmt.likeCount;
                    let newDislikeCount = cmt.dislikeCount;

                    // 상태 변경에 따른 수치 반영
                    if (prevType === 1 && likeType !== 1) newLikeCount--;
                    if (prevType === 0 && likeType !== 0) newDislikeCount--;

                    if (likeType === 1) newLikeCount++;
                    if (likeType === 0) newDislikeCount++;

                    return {
                        ...cmt,
                        likeCount: newLikeCount,
                        dislikeCount: newDislikeCount,
                        userLikeType: likeType,
                    };
                });
            });

            // rollback용 백업 데이터 리턴
            return { previousStatus, previousComments };
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

        onSuccess: (data, variables) => {
            const { userNo, commentNo } = variables;

            // 서버 응답값으로 최종 상태 업데이트
            queryClient.setQueryData(["commentLikeStatus", userNo, commentNo], {
                likeType: data?.likeType ?? null,
            });

            console.log(
                "최종 commentLikeStatus:",
                queryClient.getQueryData(["commentLikeStatus", userNo, commentNo])
            );
        }
    });
}