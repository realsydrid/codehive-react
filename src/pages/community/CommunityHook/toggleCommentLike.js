import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {GetCommentLikeType, ToggleCommentLike} from "../CommunityUtil/CommunityToggleLike.js";

export function useGetCommentLikeStatus(userNo, commentNo) {
    return useQuery({
        queryKey: ["commentLikeStatus", userNo, commentNo],
        queryFn: () => GetCommentLikeType(userNo, commentNo),
        enabled: !!commentNo && !!userNo,
        staleTime: 60000, // 60초 캐시 유지
        refetchOnWindowFocus: false, // 포커스 이동 시 재요청 방지
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

            await queryClient.cancelQueries(["commentLikeStatus", userNo, commentNo]);

            const previousStatus = queryClient.getQueryData(["commentLikeStatus", userNo, commentNo]);
            const previousComments = queryClient.getQueryData(["commentDto", postNo]);

            // 선반영 상태 저장
            queryClient.setQueryData(["commentLikeStatus", userNo, commentNo], { likeType });

            // commentDto도 선반영
            queryClient.setQueryData(["commentDto", postNo], (oldComments) => {
                if (!oldComments) return oldComments;

                return oldComments.map((cmt) => {
                    if (cmt.id !== commentNo) return cmt;

                    const prevType = cmt.userLikeType;
                    let newLikeCount = cmt.likeCount;
                    let newDislikeCount = cmt.dislikeCount;

                    // rollback을 위해 미리 계산
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
        onSuccess: (_data, variables) => {
            const { userNo, commentNo, likeType } = variables;
            queryClient.setQueryData(["commentLikeStatus", userNo, commentNo], { likeType });
            console.log(
                "최종 commentLikeStatus:",
                queryClient.getQueryData(["commentLikeStatus", userNo, commentNo])
            );
        }
    });
}