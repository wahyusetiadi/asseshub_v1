"use client";
import { useEffect, useState } from "react";
import { BiX, BiUser, BiEnvelope } from "react-icons/bi";
import adminService from "@/app/api/services/adminService";
import InputField from "../ui/InputFieled";
import SelectField from "../ui/SelectField";
import { Candidate } from "@/types/candidateTypes";

interface CandidateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  candidate: Candidate | null;
}

interface Position {
  id: string;
  name: string;
}

export default function CandidateEditModal({
  isOpen,
  onClose,
  onSuccess,
  candidate,
}: CandidateEditModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    positionId: "",
  });

  const [positions, setPositions] = useState<Position[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch data posisi
  const fetchPositionData = async () => {
    try {
      const response = await adminService.getAllPositions();
      const data = response.data?.data || response.data || [];
      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
      setError("Gagal memuat data posisi");
    }
  };

  // Fetch positions saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      fetchPositionData();
    }
  }, [isOpen]);

  // Isi form dari data kandidat
  useEffect(() => {
    if (isOpen && candidate && positions.length > 0) {
      const matchedPosition = positions.find(
        (pos) => pos.name === candidate.position
      );

      setFormData({
        fullName: candidate.name || "",
        email: candidate.email || "",
        positionId: matchedPosition?.id || "",
      });
    }
  }, [isOpen, candidate, positions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, positionId: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.positionId) {
      setError("Silakan pilih posisi terlebih dahulu");
      return;
    }

    if (!candidate?.id) {
      setError("Data kandidat tidak valid");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await adminService.updatedAccount(
        candidate.id,
        formData.fullName,
        formData.email,
        formData.positionId
      );

      alert("✅ Data kandidat berhasil diperbarui");
      handleClose();
      onSuccess();
    } catch (err: unknown) {
      let errorMessage = "Gagal memperbarui data kandidat";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const apiErr = err as { response: { data: { message: string } } };
        errorMessage = apiErr.response.data.message || errorMessage;
      }
      setError(errorMessage);
      console.error("Error updating candidate:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ fullName: "", email: "", positionId: "" });
      setError("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit Kandidat</h2>
            <p className="text-sm text-gray-500 mt-1">Perbarui data kandidat</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <BiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-800">❌ {error}</p>
            </div>
          )}

          <InputField
            label="Nama Lengkap"
            leftIcon={<BiUser />}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="Contoh: John Doe"
            disabled={isSubmitting}
          />

          <InputField
            label="Email"
            leftIcon={<BiEnvelope />}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            disabled={isSubmitting}
          />

          <SelectField
            label="Posisi Jabatan"
            placeholder="-- Pilih Posisi --"
            options={positions.map((pos) => ({
              label: pos.name,
              value: pos.id,
            }))}
            value={formData.positionId}
            onChange={handleSelectChange}
            required
            helperText="Pilih posisi yang dilamar oleh kandidat"
            disabled={isSubmitting}
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:bg-gray-200 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
