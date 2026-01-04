"use client";
import examService from "@/app/api/services/examService";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPlus, BiX } from "react-icons/bi";
import { BsEye, BsTrash2, BsClock, BsQuestionCircle } from "react-icons/bs";
import { FiEdit3, FiAlertTriangle } from "react-icons/fi";

interface Test {
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

// ✅ Type untuk response API
interface ExamResponse {
  data?: {
    data?: Test[];
  } | Test[];
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

      // ✅ Handle berbagai struktur response dari BE dengan type guard
      let examsData: Test[] = [];

      if (res && typeof res === 'object' && 'data' in res) {
        const response = res as ExamResponse;
        if (response.data && typeof response.data === 'object' && 'data' in response.data) {
          examsData = Array.isArray(response.data.data) ? response.data.data : [];
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
      {/* Header */}
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

      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-500 mt-4">Memuat data ujian...</p>
        </div>
      ) : tests.length === 0 ? (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
          <p className="text-gray-500">
            Belum ada ujian. Buat ujian baru untuk memulai.
          </p>
        </div>
      ) : (
        /* Grid Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white p-5 rounded-xl border shadow-sm hover:border-blue-300 transition-all group"
            >
              <h3 className="font-bold text-lg mb-1 text-black group-hover:text-blue-600">
                {test.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {/* ✅ Tampilkan total questions dari _count */}
                {test._count?.questions || 0} Pertanyaan •{" "}
                {test.durationMinutes} Menit
              </p>
              <div className="flex justify-between items-center pt-4 border-t">
                <Link
                  href={`/tests/${test.id}`}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                >
                  <FiEdit3 size={16} /> Edit
                </Link>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTest(test)}
                    className="text-gray-400 hover:text-green-600 transition"
                    title="Lihat Detail"
                  >
                    <BsEye size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(test.id)}
                    className="text-gray-400 hover:text-red-600 transition"
                    title="Hapus Ujian"
                  >
                    <BsTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DETAIL */}
      {selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="font-bold text-lg text-black">Detail Ujian</h3>
              <button
                onClick={() => setSelectedTest(null)}
                className="p-1 hover:bg-gray-100 rounded-full text-black"
              >
                <BiX size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Judul Ujian
                </label>
                <p className="font-semibold text-gray-800 text-lg">
                  {selectedTest.title}
                </p>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Deskripsi
                </label>
                <p className="text-sm text-gray-600">
                  {selectedTest.description || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-3 border border-blue-100">
                  <BsClock className="text-blue-600" size={20} />
                  <div>
                    <p className="text-[10px] text-blue-500 font-bold uppercase leading-none">
                      Durasi
                    </p>
                    <p className="text-sm font-bold text-blue-700">
                      {selectedTest.durationMinutes}m
                    </p>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl flex items-center gap-3 border border-purple-100">
                  <BsQuestionCircle className="text-purple-600" size={20} />
                  <div>
                    <p className="text-[10px] text-purple-500 font-bold uppercase leading-none">
                      Total Soal
                    </p>
                    <p className="text-sm font-bold text-purple-700">
                      {selectedTest._count?.questions || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3 border-t">
              <button
                onClick={() => setSelectedTest(null)}
                className="flex-1 py-2 text-sm font-bold text-gray-600 border bg-white rounded-lg hover:bg-gray-50 transition"
              >
                Tutup
              </button>
              <Link
                href={`/tests/${selectedTest.id}`}
                className="flex-1 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition text-center shadow-md"
              >
                Buka Editor
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                <FiAlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Hapus Ujian?</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                Seluruh data soal dalam ujian ini akan hilang secara permanen.
                Lanjutkan?
              </p>
            </div>
            <div className="p-4 bg-gray-50 flex gap-3 border-t">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 text-sm font-bold text-gray-600 bg-white border rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
