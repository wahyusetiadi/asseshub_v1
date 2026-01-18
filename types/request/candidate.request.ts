// import { CandidateStatus } from "../candidateTypes";

export interface CreateCandidateRequest {
  name: string;
  email: string;
  password?: string;
  position?: string;
}

export interface UpdateCandidateRequest {
  name?: string;
  email?: string;
  positionId?: string;
  // status?: CandidateStatus;
}
