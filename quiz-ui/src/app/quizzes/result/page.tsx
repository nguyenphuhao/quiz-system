"use client";
import { useSearchParams } from "next/navigation";
import { QuizResult } from "../../../components/QuizResult/QuizResult";
import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../../providers/AuthProvider";
import axios from "axios";
import { ApiEndpoint } from "../../../config/apiEndpoints";
import { Loader } from "../../../components/Loader/Loader";

export default function Result() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const auth = useAuthContext();
  const authUser = auth.getAuthenticatedUser();
  const { data: quizResult, isLoading } = useQuery({
    queryKey: [new Date().getTime],
    queryFn: async () => {
      const response = await axios.post(
        ApiEndpoint.local.baseUrl + `/quizzes/${quizId}/result`,
        {
          userId: authUser?.id,
          quizId,
        }
      );
      return response.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <QuizResult
      quizId={quizId || ""}
      quizName={quizResult.quizName}
      totalQuestions={quizResult?.totalQuestions}
      totalCorrectAnswers={quizResult?.totalCorrectAnswers}
    />
  );
}
