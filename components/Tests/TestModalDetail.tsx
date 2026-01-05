import { Test } from "@/app/(admin)/tests/page";
import Link from "next/link";
import { ReactNode } from "react";
import { BiX } from "react-icons/bi";
import { BsClock, BsQuestionCircle } from "react-icons/bs";
import Button from "../ui/Button";
import { MdDateRange } from "react-icons/md";

interface Props {
  test: Test;
  onClose: () => void;
}

export const formatDate = (
  dateInput: string | Date | undefined | null
): string => {
  if (!dateInput) return "-";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return "Format Tanggal Salah";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function TestDetailModal({ test, onClose }: Props) {
  const Info = [
    {
      label: "Durasi",
      icon: <BsClock />,
      value: test.durationMinutes,
    },
    {
      label: "Total Soal",
      icon: <BsQuestionCircle />,
      value: test._count?.questions,
    },
    {
      label: "Start At",
      icon: <MdDateRange />,
      value: test.startAt,
    },
    {
      label: "End At",
      icon: <MdDateRange />,
      value: test.endAt,
    },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b">
          <h3 className="font-bold text-lg">Detail Ujian</h3>
          <button onClick={onClose}>
            <BiX size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400">Judul</label>
            <p className="font-semibold">{test.title}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Info.map((i) => (
              <InfoBox
                key={i.label}
                icon={i.icon}
                label={i.label}
                value={i.value}
              />
            ))}
            <InfoBox
              icon={<BsClock />}
              label="Durasi"
              value={`${test.durationMinutes}m`}
            />
            <InfoBox
              icon={<BsQuestionCircle />}
              label="Total Soal"
              value={test._count?.questions || 0}
            />
            <InfoBox
              icon={<BsClock />}
              label="Start At"
              value={formatDate(test.endAt)}
            />
            <InfoBox
              icon={<BsQuestionCircle />}
              label="End At"
              value={formatDate(test.startAt)}
            />
          </div>
        </div>
        <div className="p-4 flex gap-3 w-full rounded-lg">
          <Button
            title="Tutup"
            onClick={onClose}
            variant="destructive"
            className="w-full"
          />
          <Link
            href={`/tests/${test.id}`}
            className="hidden flex-1 text-center bg-blue-600 text-white rounded-lg"
          >
            Buka Editor
          </Link>
        </div>
      </div>
    </div>
  );
}

interface InfoBoxProps {
  icon: ReactNode;
  label: string;
  value: string | number | undefined;
}

function InfoBox({ icon, label, value }: InfoBoxProps) {
  return (
    <div className="p-3 rounded-xl border flex items-center gap-3">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
