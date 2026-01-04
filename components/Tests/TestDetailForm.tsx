"use client";
import { TestData } from "@/types/testTypes";
import { BsCalendarEvent, BsClock } from "react-icons/bs";

interface Props {
  testData: TestData;
  setTestData: React.Dispatch<React.SetStateAction<TestData>>;
}

export default function TestDetailsForm({ testData, setTestData }: Props) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTestData({ ...testData, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
      <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-md text-sm">
          Step 1
        </span>
        Detail Ujian
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Ujian
          </label>
          <input
            name="title"
            type="text"
            value={testData.title}
            onChange={handleChange}
            placeholder="Contoh: Ujian Masuk Guild"
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            name="description"
            value={testData.description}
            onChange={handleChange}
            placeholder="Contoh: tidak untuk pemula"
            rows={2}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
              <BsCalendarEvent /> Mulai
            </label>
            <input
              name="startAt"
              type="datetime-local"
              value={testData.startAt}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
              <BsCalendarEvent /> Selesai
            </label>
            <input
              name="endAt"
              type="datetime-local"
              value={testData.endAt}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
            <BsClock /> Durasi (Menit)
          </label>
          <input
            name="durationMinutes"
            type="number"
            value={testData.durationMinutes}
            onChange={(e) =>
              setTestData({
                ...testData,
                durationMinutes: parseInt(e.target.value),
              })
            }
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
