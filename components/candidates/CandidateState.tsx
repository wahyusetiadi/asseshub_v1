// components/candidates/CandidateStats.tsx

import { BiCheckCircle, BiUpload } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import StatCard from "../ui/Card";
// import { Candidate } from "@/types/candidateTypes";
import { CandidateApi } from "@/types";

interface CandidateStatsProps {
  candidates: CandidateApi[];
}

export default function CandidateStats({ candidates }: CandidateStatsProps) {
  const todayCount = candidates.filter((c) => {
    const today = new Date().toDateString();
    // const createdDate = new Date(c.createdAt).toDateString();
    // return today === createdDate;
    return today;
  }).length;

  const cardItems = [
    {
      icon: <BsEye className="size-5 md:size-6" />,
      label: "Total Kandidat",
      value: candidates.length.toString(),
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      icon: <BiCheckCircle className="size-5 md:size-6" />,
      label: "Akun Aktif",
      value: candidates.length.toString(),
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      icon: <BiUpload className="size-5 md:size-6" />,
      label: "Baru Hari Ini",
      value: todayCount.toString(),
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
      {cardItems.map((item, index) => (
        <StatCard
          key={index}
          icon={item.icon}
          label={item.label}
          value={item.value}
          bg={item.bg}
          color={item.color}
        />
      ))}
    </div>
  );
}
