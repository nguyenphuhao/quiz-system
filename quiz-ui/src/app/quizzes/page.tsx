"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiEndpoint } from "../../config/apiEndpoints";
import { QuizCard } from "../../components/QuizCard/QuizCard";
import { Loader } from "../../components/Loader/Loader";

export default function Quizzes() {
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ["getQuizzes"],
    queryFn: async () => {
      const response = await axios.get(ApiEndpoint.local.baseUrl + "/quizzes");
      return response.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl my-6">All quizzes</h2>
      <div className="grid grid-cols-4 gap-4">
        {quizzes?.length &&
          quizzes.map((q: any) => (
            <QuizCard key={q.id} quizId={q.id} quizName={q.title} />
          ))}
      </div>
    </div>
  );
}
