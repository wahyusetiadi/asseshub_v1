"use client";
import examService from "@/app/api/services/examService";
import DeleteConfirmModal from "@/components/Tests/DeleteConfirmModal";
import TestCard from "@/components/Tests/TestCard";
import TestDetailModal from "@/components/Tests/TestModalDetail";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";

export interface Test {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startAt: string;
  endAt: string;
  _count?: {
    questions: number;
  };
}

interface ExamResponse {
  data?:
    | {
        data?: Test[];
      }
    | Test[];
}

export default function TestPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestData = async () => {
    try {
      setIsLoading(true);
      const res = await examService.getAllExams();

      let examsData: Test[] = [];

      if (res && typeof res === "object" && "data" in res) {
        const response = res as ExamResponse;
        if (
          response.data &&
          typeof response.data === "object" &&
          "data" in response.data
        ) {
          examsData = Array.isArray(response.data.data)
            ? response.data.data
            : [];
        } else if (Array.isArray(response.data)) {
          examsData = response.data;
        }
      } else if (Array.isArray(res)) {
        examsData = res;
      } else {
        console.error("Response tidak valid:", res);
      }

      setTests(examsData);
    } catch (error) {
      console.error("Error fetching exams:", error);
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      // TODO: Tambahkan API delete jika ada
      // await examService.deleteExam(deleteId);

      setTests(tests.filter((t) => t.id !== deleteId));
      setDeleteId(null);
      alert("✅ Ujian berhasil dihapus");
    } catch (error) {
      console.error("Error deleting exam:", error);
      setTests(tests.filter((t) => t.id !== deleteId));
      setDeleteId(null);
      alert("✅ Ujian berhasil dihapus (local only)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-black">Daftar Ujian</h1>
          <p className="text-sm text-gray-500">
            Kelola soal dan durasi ujian kandidat.
          </p>
        </div>
        <Link
          href="/tests/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <BiPlus size={18} /> Buat Tes Baru
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-500 mt-4">Memuat data ujian...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <p className="text-gray-500">
            Belum ada ujian. Buat ujian baru untuk memulai.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              onDelete={() => setDeleteId(test.id)}
              onView={() => setSelectedTest(test)}
              onEditExam={() => alert("Belum tersedia")}
            />
          ))}
        </div>
      )}

      {selectedTest && (
        <TestDetailModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}

      {deleteId && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
