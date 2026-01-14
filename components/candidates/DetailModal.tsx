"use client";
import { useState, useEffect } from "react";
import { BiX, BiUser, BiEnvelope, BiCalendar, BiHash } from "react-icons/bi";
import { BsShieldCheck } from "react-icons/bs";
import adminService from "@/app/api/services/adminService";
import { CandidateDetail } from "@/types/candidateTypes";
import { formatDate } from "@/helpers/DateFormat";

interface CandidateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string | null;
}

export default function CandidateDetailModal({
  isOpen,
  onClose,
  candidateId,
}: CandidateDetailModalProps) {
  const [candidate, setCandidate] = useState<CandidateDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchCandidateDetail();
    }
  }, [isOpen, candidateId]);

  const fetchCandidateDetail = async () => {
    if (!candidateId) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await adminService.getAccountById(candidateId);
      console.log("candidate", response);

      let data: CandidateDetail | null = null;
      if (response?.data?.data) {
        data = response.data.data;
      } else if (response?.data) {
        data = response.data;
      }

      if (!data) {
        throw new Error("Data kandidat tidak ditemukan");
      }

      setCandidate(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat detail kandidat";
      setError(errorMessage);
      console.error("Error fetching candidate detail:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCandidate(null);
    setError("");
    onClose();
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Kandidat</h2>
            <p className="text-sm text-gray-500 mt-1">
              Informasi lengkap akun kandidat
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <BiX size={24} />
          </button>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500">Memuat data kandidat...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-800">❌ {error}</p>
              <button
                onClick={fetchCandidateDetail}
                className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
              >
                Coba lagi
              </button>
            </div>
          )}

          {candidate && !isLoading && (
            <div className="space-y-6">
              <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                    {candidate.name}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {candidate.username}
                    </h3>
                    {/* <p className="text-gray-600 text-sm mt-1">
                      {candidate.email}
                    </p> */}
                    {candidate.role && (
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {candidate.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg divide-y">
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BsShieldCheck className="text-blue-600" />
                    Informasi Akun
                  </h4>

                  <div className="space-y-3">
                    <div className="hidden flex items-start gap-3">
                      <BiHash className="text-gray-400 mt-1" size={20} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          User ID
                        </p>
                        <p className="text-sm text-gray-800 font-mono">
                          {candidate.id}
                        </p>
                      </div>
                    </div>

                    {candidate.username && (
                      <div className="flex items-start gap-3">
                        <BiUser className="text-gray-400 mt-1" size={20} />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 font-medium">
                            Username
                          </p>
                          <p className="text-sm text-gray-800 font-semibold">
                            {candidate.username}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <BiEnvelope className="text-gray-400 mt-1" size={20} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          Email Address
                        </p>
                        <p className="text-sm text-gray-800">
                          {candidate.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hidden">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BiCalendar className="text-blue-600" />
                    Timeline
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Dibuat pada
                        </p>
                        <p className="text-sm text-gray-800">
                          {formatDate(candidate.createdAt)}
                        </p>
                      </div>
                    </div>

                    {candidate.updatedAt && (
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Terakhir diupdate
                          </p>
                          <p className="text-sm text-gray-800">
                            {formatDate(candidate.updatedAt)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="hidden bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Info:</strong> Password kandidat telah digenerate
                  otomatis saat pembuatan akun. Jika kandidat lupa password,
                  gunakan fitur reset password.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {candidate && !isLoading && (
          <div className="p-6 border-t bg-gray-50 rounded-b-xl">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Tutup
              </button>
              {/* Tambahan action buttons bisa ditambahkan disini */}
              {/* <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                Edit
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
