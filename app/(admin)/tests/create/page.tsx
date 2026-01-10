"use client";
import examService from "@/app/api/services/examService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { BiSave } from "react-icons/bi";
import { FiCalendar, FiClock } from "react-icons/fi";
import { TestData } from "@/types/testTypes";
import adminService from "@/app/api/services/adminService";
import SelectField from "@/components/ui/SelectField";
import InputField from "@/components/ui/InputFieled";
import Button from "@/components/ui/Button";

// ✅ Type untuk response API
interface CreateExamResponse {
  data?: {
    data?: {
      id: string;
    };
    id?: string;
  };
}

interface Position {
  id: string;
  name: string;
}

export default function CreateTestPage() {
  const router = useRouter();
  const [testData, setTestData] = useState<TestData>({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    categoryId: "",
    durationMinutes: 120,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  const fetchPositionData = async () => {
    try {
      const response = await adminService.getAllPositions();
      const data = response.data?.data || response.data || [];

      console.log("data");

      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    fetchPositionData();
  }, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTestData((prev) => ({ ...prev, categoryId: e.target.value }));
    // setError("");
  };

  const handleSave = async () => {
    try {
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

      const response = (await examService.createExam(
        testData
      )) as CreateExamResponse;
      const newExamId = response?.data?.data?.id || response?.data?.id;
      if (!newExamId) {
        throw new Error("ID exam tidak ditemukan dalam response");
      }
      alert("✅ Exam berhasil dibuat! Silakan tambahkan soal.");
      router.push(`/tests/${newExamId}`);
    } catch (error) {
      console.error("Error creating exam:", error);
      if (error instanceof Error) {
        alert(`❌ Gagal membuat exam: ${error.message}`);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const apiError = error as {
          response?: { data?: { message?: string } };
        };
        alert(
          `❌ Gagal membuat exam: ${
            apiError.response?.data?.message || "Unknown error"
          }`
        );
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

          <Button
            size="lg"
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            leftIcon={<BiSave />}
            title={isSaving ? "Menyimpan..." : "Lanjut ke Soal"}
          />
        </div>

        {/* Form Detail Exam */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden">
          <div className="p-6 border-b border-slate-300 bg-linear-to-r from-blue-50 to-purple-50">
            <h2 className="font-bold text-lg text-gray-800">Detail Ujian</h2>
            <p className="text-sm text-gray-500">
              Isi informasi dasar tentang ujian
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Judul Ujian */}
            <InputField
              label="Judul Ujian"
              type="text"
              value={testData.title}
              onChange={(e) =>
                setTestData({ ...testData, title: e.target.value })
              }
              placeholder="Contoh: Tes Kemampuan logika"
              maxLength={100}
              helperText={`${testData.title.length}/100 karakter`}
              required
            />
            <SelectField
              label="Posisi Jabatan"
              placeholder="-- Pilih Posisi --"
              // Transform data posisi menjadi format label & value
              options={positions.map((pos) => ({
                label: pos.name,
                value: pos.id,
              }))}
              value={testData.categoryId}
              onChange={handleSelectChange}
              required
              helperText="Pilih posisi yang dilamar oleh kandidat"
              // disabled={isSubmitting}
            />

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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {testData.description.length}/500 karakter
              </p>
            </div>
            {/* Waktu Ujian */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Waktu Mulai"
                type="datetime-local"
                leftIcon={<FiCalendar />}
                value={testData.startAt}
                onChange={(e) =>
                  setTestData({ ...testData, startAt: e.target.value })
                }
                required
              />
              <InputField
                label="Waktu Selesai"
                type="datetime-local"
                leftIcon={<FiCalendar />}
                value={testData.endAt}
                onChange={(e) =>
                  setTestData({ ...testData, endAt: e.target.value })
                }
                required
              />
            </div>

            {/* Durasi */}
            <InputField
              label="Durasi Pengerjaan (Menit)"
              type="number"
              leftIcon={<FiClock />}
              value={testData.durationMinutes}
              onChange={(e) =>
                setTestData({
                  ...testData,
                  durationMinutes: parseInt(e.target.value),
                })
              }
              min={1}
              max={480}
              required
              helperText={`Kandidat akan memiliki waktu ${
                testData.durationMinutes || "-"
              } untuk menyelesaikan ujian`}
            />
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
