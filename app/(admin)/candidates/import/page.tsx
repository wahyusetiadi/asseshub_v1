"use client";
import { useState, useRef } from "react";
import {
  BiArrowBack,
  BiUpload,
  BiDownload,
  BiCheckCircle,
} from "react-icons/bi";
import { BsFiletypeCsv } from "react-icons/bs";
import Link from "next/link";
import { api } from "@/helpers/lib/api";
import { useRouter } from "next/navigation";

// ✅ Tambahkan interface ini
interface CandidateData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
}

export default function ImportCandidatesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CandidateData[]>([]); // ✅ Ganti any[] dengan CandidateData[]
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split("\n");
      const headers = lines[0].split(",");

      const data = lines.slice(1, 6).map((line) => {
        const values = line.split(",");
        // ✅ Ganti any dengan CandidateData
        return headers.reduce((obj, header, index) => {
          obj[header.trim() as keyof CandidateData] =
            values[index]?.trim() || "";
          return obj;
        }, {} as CandidateData);
      });

      setPreview(data.filter((row) => row.fullName || row.email));
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      const response = await api.importCandidates(file);

      if (response.success && response.data) {
        setUploadSuccess(true);
        console.log("Imported candidates:", response.data);

        setTimeout(() => {
          router.push("/candidates");
        }, 3000);
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Gagal import kandidat");
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `fullName,email,phone,position
John Doe,john@example.com,081234567890,Software Engineer
Jane Smith,jane@example.com,081298765432,Product Manager
Michael Johnson,michael@example.com,081212345678,UI/UX Designer
Sarah Williams,sarah@example.com,081387654321,Data Analyst`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_candidates.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/candidates"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <BiArrowBack size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Import Kandidat (CSV)
          </h1>
          <p className="text-gray-500 text-sm">
            Upload file CSV untuk menambahkan banyak kandidat sekaligus
          </p>
        </div>
      </div>

      {/* Success Message */}
      {uploadSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
          <BiCheckCircle className="text-green-600" size={24} />
          <div>
            <p className="font-semibold text-green-800">Import berhasil!</p>
            <p className="text-sm text-green-600">
              {preview.length} kandidat telah ditambahkan.
            </p>
          </div>
        </div>
      )}

      {/* Download Template Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <BsFiletypeCsv className="text-blue-600 text-4xl shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              📥 Belum punya template CSV?
            </h3>
            <p className="text-sm text-blue-700 mb-4">
              Download template CSV untuk memastikan format file Anda sesuai
              dengan sistem.
              <br />
              <span className="font-semibold">Format kolom:</span> fullName,
              email, phone, position
            </p>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
            >
              <BiDownload size={18} />
              Download Template CSV
            </button>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border shadow-sm p-8">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        {!file ? (
          // Upload Area
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
          >
            <BiUpload className="mx-auto text-gray-400 mb-4" size={56} />
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Klik untuk upload file CSV
            </p>
            <p className="text-sm text-gray-500 mb-1">
              atau drag and drop file ke sini
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Format yang didukung: <span className="font-semibold">.csv</span>{" "}
              (Maksimal 5MB)
            </p>
          </div>
        ) : (
          // File Preview & Upload
          <div>
            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6 border">
              <div className="flex items-center gap-3">
                <BsFiletypeCsv className="text-green-600" size={36} />
                <div>
                  <p className="font-semibold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB • {preview.length} baris
                    data
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                }}
                className="text-red-600 hover:text-red-700 text-sm font-semibold hover:bg-red-50 px-3 py-1.5 rounded transition"
              >
                Hapus File
              </button>
            </div>

            {/* Preview Table */}
            {preview.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  👀 Preview Data
                  <span className="text-sm font-normal text-gray-500">
                    (menampilkan {preview.length} baris pertama)
                  </span>
                </h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">
                          Nama Lengkap
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">
                          Telepon
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700 text-xs uppercase tracking-wider">
                          Posisi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {preview.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">
                            {row.fullName || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.email || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.phone || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.position || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={isUploading || preview.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-sm"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <BiUpload size={20} />
                  Upload & Import {preview.length} Kandidat
                </>
              )}
            </button>

            {/* Info Note */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 <span className="font-semibold">Tips:</span> Pastikan semua
                email unik dan tidak ada data yang kosong untuk kolom wajib
                (Nama & Email).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-gray-50 border rounded-xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          📋 Panduan Import CSV
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">1.</span>
            Download template CSV yang sudah disediakan
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">2.</span>
            Isi data kandidat sesuai format (fullName, email, phone, position)
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">3.</span>
            Pastikan tidak ada baris kosong di tengah data
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">4.</span>
            Upload file CSV dan preview data sebelum import
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 font-bold">5.</span>
            Klik tombol import untuk menambahkan kandidat ke database
          </li>
        </ul>
      </div>
    </div>
  );
}
