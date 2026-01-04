"use client";
import examService from "@/app/api/services/examService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { BiSave } from "react-icons/bi";
import { FiCalendar, FiClock } from "react-icons/fi";
import { TestData } from "@/types/testTypes";

// ✅ Type untuk response API
interface CreateExamResponse {
  data?: {
    data?: {
      id: string;
    };
    id?: string;
  };
}

export default function CreateTestPage() {
  const router = useRouter();
  const [testData, setTestData] = useState<TestData>({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    durationMinutes: 120,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      // ✅ Validasi
      if (!testData.title.trim()) {
        alert("❌ Judul ujian tidak boleh kosong");
        return;
      }
      if (!testData.startAt || !testData.endAt) {
        alert("❌ Mohon tentukan waktu mulai dan selesai");
        return;
      }
      if (new Date(testData.startAt) >= new Date(testData.endAt)) {
        alert("❌ Waktu mulai harus lebih awal dari waktu selesai");
        return;
      }
      if (testData.durationMinutes < 1) {
        alert("❌ Durasi minimal 1 menit");
        return;
      }

      setIsSaving(true);

      // ✅ Hanya buat Exam (tanpa questions)
      const response = await examService.createExam(testData) as CreateExamResponse;

      // Handle berbagai struktur response
      const newExamId = response?.data?.data?.id || response?.data?.id;

      if (!newExamId) {
        throw new Error("ID exam tidak ditemukan dalam response");
      }

      alert("✅ Exam berhasil dibuat! Silakan tambahkan soal.");

      // ✅ Redirect ke halaman edit untuk tambah questions
      router.push(`/tests/${newExamId}`);

    } catch (error) {
      console.error("Error creating exam:", error);

      // ✅ Type guard untuk error handling
      if (error instanceof Error) {
        alert(`❌ Gagal membuat exam: ${error.message}`);
      } else if (typeof error === 'object' && error !== null && 'response' in error) {
        const apiError = error as { response?: { data?: { message?: string } } };
        alert(`❌ Gagal membuat exam: ${apiError.response?.data?.message || 'Unknown error'}`);
      } else {
        alert("❌ Gagal membuat exam");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/tests"
              className="p-2 bg-white hover:bg-gray-100 rounded-full transition border shadow-sm"
            >
              <BsArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Buat Ujian Baru
              </h1>
              <p className="text-sm text-gray-500">
                Langkah 1: Informasi Dasar Ujian
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BiSave size={20} />
            {isSaving ? "Menyimpan..." : "Lanjut ke Soal"}
          </button>
        </div>

        {/* Form Detail Exam */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b bg-linear-to-r from-blue-50 to-purple-50">
            <h2 className="font-bold text-lg text-gray-800">Detail Ujian</h2>
            <p className="text-sm text-gray-500">
              Isi informasi dasar tentang ujian
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Judul Ujian */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Judul Ujian <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={testData.title}
                onChange={(e) =>
                  setTestData({ ...testData, title: e.target.value })
                }
                placeholder="Contoh: Tes Kemampuan Logika"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                maxLength={100}
              />
              <p className="text-xs text-gray-400 mt-1">
                {testData.title.length}/100 karakter
              </p>
            </div>

            {/* Deskripsi */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={testData.description}
                onChange={(e) =>
                  setTestData({ ...testData, description: e.target.value })
                }
                placeholder="Jelaskan tujuan dan materi ujian ini..."
                rows={4}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {testData.description.length}/500 karakter
              </p>
            </div>

            {/* Waktu Ujian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1" />
                  Waktu Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={testData.startAt}
                  onChange={(e) =>
                    setTestData({ ...testData, startAt: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <FiCalendar className="inline mr-1" />
                  Waktu Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={testData.endAt}
                  onChange={(e) =>
                    setTestData({ ...testData, endAt: e.target.value })
                  }
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Durasi */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FiClock className="inline mr-1" />
                Durasi Pengerjaan (Menit) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={testData.durationMinutes}
                onChange={(e) =>
                  setTestData({
                    ...testData,
                    durationMinutes: parseInt(e.target.value) || 0,
                  })
                }
                min={1}
                max={480}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <p className="text-xs text-gray-400 mt-1">
                Kandidat akan memiliki waktu{" "}
                <strong>{testData.durationMinutes} menit</strong> untuk
                menyelesaikan ujian
              </p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
            💡
          </div>
          <div className="text-sm text-blue-800">
            <strong>Langkah selanjutnya:</strong> Setelah menyimpan informasi
            dasar, Anda akan diarahkan untuk menambahkan soal ujian. Setiap soal
            akan disimpan secara individual untuk menghindari kehilangan data.
          </div>
        </div>
      </div>
    </div>
  );
}
