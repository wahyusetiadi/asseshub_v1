"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiArrowBack, BiUser, BiEnvelope, BiSave } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
import Link from "next/link";
import adminService from "@/app/api/services/adminService";

export default function CreateCandidatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    sendEmail: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await adminService.generateAccount(
        formData.fullName,
        formData.email
      );

      if (response.success) {
        setShowSuccess(true);
        console.log("Created candidate:", response.data);

        // TODO: Send email if sendEmail is true
        if (formData.sendEmail) {
          console.log("Sending email to:", formData.email);
        }

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/candidates");
        }, 2000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Gagal membuat kandidat";
      setError(errorMessage);
      console.error("Error creating candidate:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/candidates" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <BiArrowBack size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Generate User Account</h1>
          <p className="text-gray-500 text-sm">Buat akun kandidat baru untuk mengikuti tes</p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <BsCheckCircle className="text-green-600" size={24} />
          <div>
            <p className="font-semibold text-green-800">Akun berhasil dibuat!</p>
            <p className="text-sm text-green-600">
              Username dan password telah digenerate otomatis oleh sistem.
              {formData.sendEmail && " Kredensial telah dikirim ke email kandidat."}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <div>
            <p className="font-semibold text-red-800">Gagal membuat akun</p>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Info Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BiUser className="text-blue-600" />
            Informasi Kandidat
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john.doe@example.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Phone - Optional untuk info tambahan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                No. Telepon <span className="text-gray-400 text-xs">(opsional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+62 812-3456-7890"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Position - Optional untuk info tambahan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi yang Dilamar <span className="text-gray-400 text-xs">(opsional)</span>
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              >
                <option value="">Pilih Posisi</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Product Manager">Product Manager</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Marketing Specialist">Marketing Specialist</option>
              </select>
            </div>
          </div>
        </div>

        {/* Info Card - Auto Generate */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BiUser className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Username & Password Otomatis
              </h3>
              <p className="text-sm text-blue-700">
                Sistem akan secara otomatis generate <strong>username</strong> dan <strong>password</strong> yang aman untuk kandidat. 
                Kredensial ini akan dikirim ke email kandidat.
              </p>
            </div>
          </div>
        </div>

        {/* Email Notification Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BiEnvelope className="text-blue-600" />
            Notifikasi Email
          </h2>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              name="sendEmail"
              checked={formData.sendEmail}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600"
            />
            <label className="text-sm font-medium text-gray-700">
              Kirim email kredensial secara otomatis ke kandidat
            </label>
          </div>

          {formData.sendEmail && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                📧 Email akan dikirim berisi <strong>username</strong>, <strong>password</strong>, dan link untuk akses ujian.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Membuat Akun...
              </>
            ) : (
              <>
                <BiSave size={20} />
                Buat Akun Kandidat
              </>
            )}
          </button>

          <Link
            href="/candidates"
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition text-center"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
