// components/candidates/CandidateStats.tsx
import { Candidate } from "@/types/api";
import { BiCheckCircle, BiUpload } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
import StatCard from "../ui/Card";

interface CandidateStatsProps {
  candidates: Candidate[];
}

export default function CandidateStats({ candidates }: CandidateStatsProps) {
  const todayCount = candidates.filter((c) => {
    const today = new Date().toDateString();
    const createdDate = new Date(c.createdAt).toDateString();
    return today === createdDate;
  }).length;

  const cardItems = [
    {
      icon: <BsEye size={24} />,
      label: "Total Kandidat",
      value: candidates.length.toString(),
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      icon: <BiCheckCircle size={24} />,
      label: "Akun Aktif",
      value: candidates.length.toString(),
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      icon: <BiUpload size={24} />,
      label: "Baru Hari Ini",
      value: todayCount.toString(),
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
