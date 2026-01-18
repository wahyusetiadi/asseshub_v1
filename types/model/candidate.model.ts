export type CandidateStatus =
  | "pending"
  | "sent"
  | "opened"
  | "complete"
  | "active";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  position?: string;
  status?: CandidateStatus;
}
