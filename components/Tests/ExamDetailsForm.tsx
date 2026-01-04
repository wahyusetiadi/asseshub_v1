// components/admin/ExamDetailsForm.tsx
"use client";

import { BiSave } from "react-icons/bi";
import { FiCalendar, FiClock } from "react-icons/fi";
import { BsQuestionCircle, BsClock } from "react-icons/bs";

interface TestData {
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
}

interface ExamDetailsFormProps {
  testData: TestData;
  setTestData: React.Dispatch<React.SetStateAction<TestData>>;
  onSave: () => void;
  isSaving: boolean;
  questionCount: number;
}

export default function ExamDetailsForm({
  testData,
  setTestData,
  onSave,
  isSaving,
  questionCount,
}: ExamDetailsFormProps) {
  return (
    <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
      {/* Form Detail Exam */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-5 border-b bg-linear-to-r from-blue-50 to-purple-50">
          <h2 className="font-bold text-lg text-gray-800">Detail Ujian</h2>
          <p className="text-sm text-gray-500">Informasi dasar ujian</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Judul */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Judul Ujian
            </label>
            <input
              type="text"
              value={testData.title}
              onChange={(e) =>
                setTestData({ ...testData, title: e.target.value })
              }
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              maxLength={100}
            />
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
              rows={3}
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              maxLength={500}
            />
          </div>

          {/* Waktu */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                <FiCalendar className="inline mr-1" />
                Waktu Mulai
              </label>
              <input
                type="datetime-local"
                value={testData.startAt}
                onChange={(e) =>
                  setTestData({ ...testData, startAt: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                <FiCalendar className="inline mr-1" />
                Waktu Selesai
              </label>
              <input
                type="datetime-local"
                value={testData.endAt}
                onChange={(e) =>
                  setTestData({ ...testData, endAt: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Durasi */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              <FiClock className="inline mr-1" />
              Durasi (Menit)
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
              className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Button Update Exam */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <BiSave size={20} />
            {isSaving ? "Menyimpan..." : "💾 Update Info Ujian"}
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            ⚠️ Fitur update belum tersedia
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold text-sm text-gray-700 mb-4">
          Statistik Soal
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <BsQuestionCircle className="text-blue-600" size={20} />
              <span className="text-sm font-semibold text-blue-700">
                Total Soal
              </span>
            </div>
            <span className="text-xl font-bold text-blue-700">
              {questionCount}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <BsClock className="text-purple-600" size={20} />
              <span className="text-sm font-semibold text-purple-700">
                Durasi
              </span>
            </div>
            <span className="text-xl font-bold text-purple-700">
              {testData.durationMinutes}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
