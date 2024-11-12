"use client";
import axios from "axios";
import { JoinQuiz } from "../../../components/JoinQuiz/JoinQuiz";
import { ApiEndpoint } from "../../../config/apiEndpoints";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Loader } from "../../../components/Loader/Loader";
import { useAuthContext } from "../../../providers/AuthProvider";
import { useEffect } from "react";

export default function Join() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");

  const { data: quiz, isLoading } = useQuery({
    queryKey: ["getQuiz", quizId],
    queryFn: async () => {
      const response = await axios.get(
        ApiEndpoint.local.baseUrl + "/quizzes/" + quizId
      );
      return response.data;
    },
  });

  const auth = useAuthContext();
  const authUser = auth.getAuthenticatedUser();
  const {
    mutate: join,
    isPending,
    isSuccess: joinSuccess,
  } = useMutation({
    mutationKey: ["joinQuiz", quizId, authUser?.id],
    mutationFn: async (payload: {
      quizId: number;
      userId: number;
      nickName: string;
    }) => {
      const response = await axios.post(
        ApiEndpoint.local.baseUrl + "/quizzes/join",
        {
          ...payload,
        }
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (joinSuccess) {
      window.location.href = `/quizzes/start?quizId=${quiz.id}`;
    }
  }, [joinSuccess]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <JoinQuiz
      quizName={quiz?.title}
      onClickJoin={(nickName: string) =>
        join({
          quizId: quiz.id,
          userId: authUser!.id,
          nickName,
        })
      }
      disabled={isPending}
    />
  );
}
