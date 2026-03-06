"use client";

import { useState } from "react";

type Status = "LULUS" | "TIDAK LULUS" | "PROSES";

interface Result {
  name: string;
  position: string;
  status: Status;
}

export default function CekKelulusanMockup() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!number) return;

    setLoading(true);
    setResult(null);

    // simulasi delay API
    setTimeout(() => {
      const mockData: Result = {
        name: "Wahyu Setiadi",
        position: "Software Engineer",
        status:
          number === "12345"
            ? "LULUS"
            : number === "54321"
            ? "TIDAK LULUS"
            : "PROSES",
      };

      setResult(mockData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Cek Status Kelulusan
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Rekrutmen Pegawai
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nomor Pendaftaran"
            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />

          <button
            onClick={handleCheck}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Memeriksa..." : "Cek Status"}
          </button>

          {result && (
            <div className="mt-6 border border-slate-300 rounded-xl p-4 text-center space-y-2">
              <h2 className="font-semibold text-lg">{result.name}</h2>
              <p className="text-sm text-gray-600">
                Posisi: {result.position}
              </p>

              <span
                className={`inline-block mt-2 px-4 py-1 rounded-full text-white text-sm font-medium ${
                  result.status === "LULUS"
                    ? "bg-green-600"
                    : result.status === "TIDAK LULUS"
                    ? "bg-red-600"
                    : "bg-yellow-500"
                }`}
              >
                {result.status}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 text-xs text-gray-400 text-center">
          © 2026 Rekrutmen Pegawai
        </div>
      </div>
    </div>
  );
}
