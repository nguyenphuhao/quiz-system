"use client";

import { useSearchParams } from "next/navigation";
import { useAuthContext } from "../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ApiEndpoint } from "../../config/apiEndpoints";
import { Loader } from "../../components/Loader/Loader";
import { Leaderboard } from "../../components/Leaderboard/Leaderboard";

export default function LeaderboardRanking() {
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId");
  const auth = useAuthContext();
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["viewLeaderboard", quizId],
    queryFn: async () => {
      const response = await axios.get(
        ApiEndpoint.local.baseUrl + `/leaderboard/${quizId}`
      );
      return response.data;
    },
  });

  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <div className="flex flex-col justify-center items-center my-6">
        <h2 className="text-3xl my-6">Rank</h2>
        <Leaderboard
          quizName={leaderboard?.quizName}
          totalQuestions={leaderboard.totalQuestions}
          participants={leaderboard.participants}
        />
      </div>
    </>
  );
}
