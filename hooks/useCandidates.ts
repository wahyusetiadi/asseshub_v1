
import { CandidateApi } from "@/types";
// import { Candidate } from "@/types/candidateTypes";
import { useState } from "react";

export function useCandidates() {
  const [candidates, setCandidates] = useState<CandidateApi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCandidates = async () => {};

  const deleteCandidates = async (id: string) => {};

  return {
    candidates,
    isLoading,
    error,
    fetchCandidates,
    deleteCandidates,
  };
}
