"use client";
import { useEffect, useState } from "react";
import { BiX, BiUser, BiEnvelope } from "react-icons/bi";
import adminService from "@/app/api/services/adminService";
import InputField from "../ui/InputFieled";
import SelectField from "../ui/SelectField";

interface CreateCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Definisikan interface untuk posisi
interface Position {
  id: string;
  name: string;
}

export default function CreateCandidateModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCandidateModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    positionId: "", // Gunakan positionId agar lebih spesifik
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [positions, setPositions] = useState<Position[]>([]);

  // 1. Fetch Data Posisi
  const fetchPositionData = async () => {
    try {
      const response = await adminService.getAllPositions();
      // Pastikan path data sesuai dengan response API Anda (contoh: response.data.data)
      const data = response.data?.data || response.data || [];
      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPositionData();
    }
  }, [isOpen]);

  // 2. Handle Change untuk Input Biasa
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

    setIsSubmitting(true);
    setError("");

    try {
      // Pastikan adminService.generateAccount menerima parameter yang sesuai
      const response = await adminService.generateAccount(
        formData.fullName,
        formData.email,
        formData.positionId // Kirim ID posisi ke backend
      );

      if (response.data) {
        setFormData({ fullName: "", email: "", positionId: "" });
        alert("✅ Akun kandidat berhasil dibuat!");
        onClose();
        onSuccess();
      }
    } catch (err: unknown) {
      let errorMessage = "Gagal membuat akun kandidat";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "response" in err) {
        const apiErr = err as { response: { data: { message: string } } };
        errorMessage = apiErr.response.data.message || errorMessage;
      }
      setError(errorMessage);
      console.error("Error creating candidate:", err);
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
            <h2 className="text-xl font-bold text-gray-800">
              Generate Akun Kandidat
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sistem akan membuatkan akses otomatis
            </p>
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

          {/* 4. Integrasi SelectField */}
          <SelectField
            label="Posisi Jabatan"
            placeholder="-- Pilih Posisi --"
            // Transform data posisi menjadi format label & value
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
              {isSubmitting ? "Memproses..." : "Generate Akun"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
