// components/candidates/candidateColumns.tsx
"use client";
import { Candidate } from "@/types/api";
import { Column } from "../ui/DataTable";
import CandidateActions from "./CandidatesActions";

interface CandidateCellProps {
  candidate: Candidate;
}

function CandidateNameCell({ candidate }: CandidateCellProps) {
  return (
    <div>
      <div className="font-medium text-gray-900">{candidate.name}</div>
      <div className="text-xs text-gray-500">{candidate.email}</div>
    </div>
  );
}

function CandidateUsernameCell({ candidate }: CandidateCellProps) {
  return (
    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
      {candidate.username}
    </span>
  );
}

function CandidatePasswordCell({ candidate }: CandidateCellProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(candidate.password);
    alert("Password berhasil disalin!");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-gray-400">
        {candidate.password}
      </span>
      <button
        onClick={handleCopy}
        className="hidden text-xs text-blue-600 hover:text-blue-700 underline"
        title={candidate.password}
      >
        Salin
      </button>
    </div>
  );
}

interface CandidateColumnsHandlers {
  onDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CreateCandidateColumns = ({
  onDetail,
  onEdit,
  onDelete,
}: CandidateColumnsHandlers): Column<Candidate>[] => [
  {
    key: "name",
    label: "Nama Kandidat",
    // render: (c) => <CandidateNameCell candidate={c} />,
  },
  {
    key: "email",
    label: "E-Mail",
    // render: (c) => <CandidateUsernameCell candidate={c} />,
  },
  {
    key: "username",
    label: "Username",
    // render: (c) => <CandidatePasswordCell candidate={c} />,
  },
  {
    key: "password",
    label: "Password",
    render: (c) => <CandidatePasswordCell candidate={c} />,
  },
  {
    key: "position",
    label: "Posisi",
    // render: (c) => <CandidatePasswordCell candidate={c} />,
  },
  {
    key: "actions",
    label: "Aksi",
    align: "center",
    render: (c) => (
      <CandidateActions
        candidate={c}
        onDetail={onDetail}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
