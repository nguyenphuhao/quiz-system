"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { QuizQuestion } from "../../../components/QuizQuestion/QuizQuestion";
import axios from "axios";
import { ApiEndpoint } from "../../../config/apiEndpoints";
import { useSearchParams } from "next/navigation";
import { keyBy } from "lodash";
import { SecondaryButton } from "../../../components/Button/SecondaryButton";
import { Button } from "../../../components/Button/Button";
import { Loader } from "../../../components/Loader/Loader";
import { useState } from "react";
import { useAuthContext } from "../../../providers/AuthProvider";

export default function StartQuiz() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const auth = useAuthContext();
  const authUser = auth.getAuthenticatedUser();

  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key in number]: string;
  }>({});
  const { data: quiz, isLoading } = useQuery({
    queryKey: ["quizQuestions", quizId],
    queryFn: async () => {
      const response = await axios.get(
        ApiEndpoint.local.baseUrl + `/quizzes/${1}`
      );
      return response.data;
    },
  });

  const questionMap = keyBy(quiz?.singleChoiceQuestions, (q) => [q.id]);
  const questionKeys = Object.keys(questionMap);
  const { mutate: submit, isPending } = useMutation({
    mutationKey: ["submitQuiz", quizId, authUser?.id],
    mutationFn: async () => {
      const payload = {
        quizId,
        userId: authUser?.id,
        answers: questionKeys.map((questionId) => {
          return {
            questionId,
            answer: selectedAnswers?.[+questionId] || null,
          };
        }),
      };
      const response = await axios.post(
        ApiEndpoint.local.baseUrl + "/quizzes/submit",
        payload
      );
      location.href = window.location.href = `/quizzes/result?quizId=${quizId}`;
      return response.data;
    },
  });

  const handleSubmit = () => {};

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="container mx-auto">
        <div>
          {questionKeys &&
            questionKeys.map((questionKey: any, index: number) => (
              <QuizQuestion
                key={questionMap[questionKey].id}
                questionNumber={index + 1}
                question={questionMap[questionKey].question}
                answers={questionMap[questionKey].choices}
                onSelect={(questionId, answer) => {
                  const selectAnswer = {
                    [questionId]: answer,
                  };
                  setSelectedAnswers({ ...selectedAnswers, ...selectAnswer });
                }}
              />
            ))}
        </div>
        <div className="text-right">
          <SecondaryButton value="Back" onClick={() => window.history.back()} />
          <Button value="Submit" onClick={submit} disabled={isPending} />
        </div>
      </div>
    </>
  );
}
