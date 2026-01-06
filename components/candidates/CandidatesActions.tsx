// components/candidates/CandidatesActions.tsx
'use client'
import { BsEye } from "react-icons/bs";
import ActionButton from "../ui/ActionButton";
import { BiEdit, BiTrash } from "react-icons/bi";
import { Candidate } from "@/types/api";

interface CandidateActionsProps {
  candidate: Candidate;
  onDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CandidateActions({ 
  candidate, 
  onDetail, 
  onEdit, 
  onDelete 
}: CandidateActionsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <ActionButton icon={BsEye} onClick={() => onDetail(candidate.id)} />
      <ActionButton icon={BiEdit} onClick={() => onEdit(candidate.id)} />
      <ActionButton icon={BiTrash} onClick={() => onDelete(candidate.id)} />
    </div>
  );
}
