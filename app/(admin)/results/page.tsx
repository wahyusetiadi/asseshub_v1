"use client";
import examService from "@/app/api/services/examService";
import Button from "@/components/ui/Button";
import DataTable, { Column } from "@/components/ui/DataTable";
import InputField from "@/components/ui/InputFieled";
import SelectField from "@/components/ui/SelectField";
import { useEffect, useState } from "react";
import { BiDownload, BiFilter, BiSearch, BiTrophy } from "react-icons/bi";
import { FaExternalLinkAlt } from "react-icons/fa";

interface ExamResults {
  id?: string;
  userId: string;
  testId: string;
  startedat: string;
  submittedAt: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  status: string;
}

interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  category: string;
  startAt: string;
  endAt: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<ExamResults[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exam, setExam] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");

  const fetchResultExamData = async () => {
    setIsLoading(true);
    try {
      const response = await examService.resultsExam();
      const data = response.data?.data ?? [];
      const sortedData = [...data].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        const timeA = new Date(a.submittedAt).getTime();
        const timeB = new Date(b.submittedAt).getTime();
        return timeA - timeB;
      });

      setResults(sortedData);
    } catch (error) {
      console.error("Error fetch Exam results:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchExamData = async () => {
    setIsLoading(true);
    try {
      const response = await examService.getAllExams();
      console.log("exams:", response.data?.data);

      setExam(response.data?.data);
    } catch (error) {
      console.error("Error fetch Exam List", error);
    }
  };

  useEffect(() => {
    fetchResultExamData();
    fetchExamData();
  }, []);

  const columns: Column<ExamResults>[] = [
    {
      key: "rank",
      label: "Peringkat",
      align: "center",
      render: (_, index) =>
        index === 0 ? (
          <BiTrophy size={18} className="text-yellow-500 mx-auto" />
        ) : (
          <span className="font-bold text-gray-400">#{index + 1}</span>
        ),
    },
    {
      key: "userId",
      label: "Kandidat",
      render: (row) => <p className="font-bold text-gray-900">{row.userId}</p>,
    },
    {
      key: "score",
      label: "Skor Akhir",
      render: (row) => (
        <div className="flex items-center gap-2 font-bold">
          <div className="w-16 bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                row.score >= 70 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${row.score}%` }}
            />
          </div>
          {row.score}/100
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold ${
            row.status === "SUBMITTED"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.status.toUpperCase()}
        </span>
      ),
    },
    // {
    //   key: "action",
    //   label: "Detail",
    //   render: () => (
    //     <button className="hover:underline flex items-center gap-1 font-semibold text-blue-600">
    //       Analisis <FaExternalLinkAlt size={14} />
    //     </button>
    //   ),
    // },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hasil Ujian</h1>
          <p className="text-sm text-gray-500">
            Pantau nilai dan performa kandidat secara real-time.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold text-sm shadow-sm">
          <BiDownload size={18} /> Ekspor Excel
        </button>
      </div>

      {/* Filter */}
      <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="col-span-4">
          <InputField
            leftIcon={<BiSearch />}
            type="text"
            placeholder="Cari kandidat..."
          />
        </div>
        <SelectField
          placeholder="semua ujian"
          options={exam.map((ex) => ({
            label: ex.title,
            value: ex.id,
          }))}
          value={selectedExamId}
          onChange={(e) => setSelectedExamId(e.target.value)}
          className="w-fit"
        />
        <Button title="Filter Skor" leftIcon={<BiFilter />} variant="outline" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={results}
          isLoading={isLoading}
          emptyMessage="Belum ada hasil ujian"
        />
      </div>
    </div>
  );
}
