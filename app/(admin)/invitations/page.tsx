"use client";
import { api } from "@/helpers/lib/api";
import { useState } from "react";
import { BiSearch, BiEnvelope, BiCheckCircle, BiInfoCircle } from "react-icons/bi";
import { BsCalendar, BsSend } from "react-icons/bs";

interface Candidate {
  id: number;
  name: string;
  email: string;
  position: string;
  status: "pending" | "sent" | "opened" | "completed";
}

interface Test {
  id: number;
  title: string;
  duration: number;
  questions: number;
}

export default function InvitationsPage() {
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  // Dummy data
  const candidates: Candidate[] = [
    { id: 1, name: "John Doe", email: "john@example.com", position: "Software Engineer", status: "pending" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", position: "Product Manager", status: "sent" },
    { id: 3, name: "Michael Johnson", email: "michael@example.com", position: "UI/UX Designer", status: "pending" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", position: "Data Analyst", status: "pending" },
    { id: 5, name: "David Brown", email: "david@example.com", position: "Software Engineer", status: "opened" },
  ];

  const tests: Test[] = [
    { id: 1, title: "Software Engineering Assessment", duration: 90, questions: 50 },
    { id: 2, title: "Product Management Test", duration: 60, questions: 30 },
    { id: 3, title: "UI/UX Design Challenge", duration: 120, questions: 40 },
    { id: 4, title: "Data Analysis Skills Test", duration: 75, questions: 35 },
  ];

  const handleSelectCandidate = (id: number) => {
    setSelectedCandidates((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(filteredCandidates.map((c) => c.id));
    }
  };

const handleSendInvitations = async () => {
  if (!selectedTest || selectedCandidates.length === 0) {
    alert("Pilih test dan minimal 1 kandidat!");
    return;
  }

  setIsSending(true);

  try {
    const response = await api.sendInvitations({
      candidateIds: selectedCandidates,
      testId: Number(selectedTest),
      scheduleDate,
      scheduleTime,
    });

    if (response.success) {
      setSendSuccess(true);
      console.log("Invitations sent:", response.data);

      setTimeout(() => {
        setSendSuccess(false);
        setSelectedCandidates([]);
        setSelectedTest("");
        setScheduleDate("");
        setScheduleTime("");
      }, 3000);
    }
  } catch (error) {
    console.error("Send invitation error:", error);
    alert("Gagal mengirim undangan");
  } finally {
    setIsSending(false);
  }
};


  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Candidate["status"]) => {
    const styles = {
      pending: "bg-gray-100 text-gray-700",
      sent: "bg-blue-100 text-blue-700",
      opened: "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
    };
    return styles[status];
  };

  const getStatusLabel = (status: Candidate["status"]) => {
    const labels = {
      pending: "Belum Dikirim",
      sent: "Terkirim",
      opened: "Dibuka",
      completed: "Selesai",
    };
    return labels[status];
  };

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      {sendSuccess && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
          <BiCheckCircle size={24} />
          <div>
            <p className="font-semibold">Email Undangan Berhasil Dikirim!</p>
            <p className="text-sm opacity-90">{selectedCandidates.length} kandidat telah menerima undangan</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Kirim Undangan Test</h1>
        <p className="text-sm text-gray-500">Kirim email undangan test ke kandidat yang dipilih</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Candidate List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau email kandidat..."
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Candidates Table */}
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm font-semibold text-gray-700">
                  {selectedCandidates.length > 0
                    ? `${selectedCandidates.length} kandidat dipilih`
                    : "Pilih kandidat"}
                </span>
              </div>
              <span className="text-xs text-gray-500">{filteredCandidates.length} total kandidat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3 w-12"></th>
                    <th className="px-6 py-3">Nama Kandidat</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Posisi</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className={`hover:bg-blue-50/50 transition cursor-pointer ${
                        selectedCandidates.includes(candidate.id) ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectCandidate(candidate.id)}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.includes(candidate.id)}
                          onChange={() => handleSelectCandidate(candidate.id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{candidate.name}</td>
                      <td className="px-6 py-4 text-gray-600">{candidate.email}</td>
                      <td className="px-6 py-4 text-gray-500">{candidate.position}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            candidate.status
                          )}`}
                        >
                          {getStatusLabel(candidate.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar - Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Test Selection */}
          <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-5 sticky top-6">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <BiEnvelope className="text-blue-600" size={20} />
              Konfigurasi Undangan
            </h3>

            {/* Select Test */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Test <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTest}
                onChange={(e) => setSelectedTest(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">-- Pilih Test --</option>
                {tests.map((test) => (
                  <option key={test.id} value={test.id}>
                    {test.title}
                  </option>
                ))}
              </select>
              {selectedTest && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">Durasi:</span>{" "}
                    {tests.find((t) => t.id === Number(selectedTest))?.duration} menit
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Soal:</span>{" "}
                    {tests.find((t) => t.id === Number(selectedTest))?.questions} pertanyaan
                  </p>
                </div>
              )}
            </div>

            <hr />

            {/* Schedule (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BsCalendar size={14} />
                Jadwal Mulai Test (Opsional)
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Waktu</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Kosongkan jika ingin mengirim undangan segera
              </p>
            </div>

            <hr />

            {/* Email Preview Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <BiInfoCircle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-yellow-800">
                  <p className="font-semibold mb-1">Email akan berisi:</p>
                  <ul className="space-y-1 ml-3 list-disc">
                    <li>Link akses test</li>
                    <li>Username & Password</li>
                    <li>Instruksi test</li>
                    <li>Batas waktu pengerjaan</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendInvitations}
              disabled={isSending || !selectedTest || selectedCandidates.length === 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-sm"
            >
              {isSending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Mengirim Email...
                </>
              ) : (
                <>
                  <BsSend size={18} />
                  Kirim Undangan ({selectedCandidates.length})
                </>
              )}
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-linear-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg p-6">
            <h4 className="font-semibold mb-4 opacity-90">Statistik Undangan</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Total Kandidat</span>
                <span className="text-2xl font-bold">{candidates.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Sudah Dikirim</span>
                <span className="text-2xl font-bold">
                  {candidates.filter((c) => c.status === "sent" || c.status === "opened").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm opacity-80">Belum Dikirim</span>
                <span className="text-2xl font-bold">
                  {candidates.filter((c) => c.status === "pending").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Template Preview (Optional) */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📧 Preview Template Email</h3>
        <div className="bg-gray-50 border rounded-lg p-6 space-y-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Subject:</p>
            <p className="text-gray-600">Undangan Mengikuti Test - {selectedTest ? tests.find((t) => t.id === Number(selectedTest))?.title : "[Nama Test]"}</p>
          </div>
          <hr />
          <div className="space-y-3 text-gray-700">
            <p>Halo <span className="font-semibold">[Nama Kandidat]</span>,</p>
            <p>
              Anda telah diundang untuk mengikuti test <span className="font-semibold">{selectedTest ? tests.find((t) => t.id === Number(selectedTest))?.title : "[Nama Test]"}</span>.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
              <p className="font-semibold text-blue-900 mb-2">Detail Test:</p>
              <p>• Durasi: {selectedTest ? tests.find((t) => t.id === Number(selectedTest))?.duration : "XX"} menit</p>
              <p>• Jumlah Soal: {selectedTest ? tests.find((t) => t.id === Number(selectedTest))?.questions : "XX"} pertanyaan</p>
              {scheduleDate && scheduleTime && (
                <p>• Jadwal: {scheduleDate} pukul {scheduleTime}</p>
              )}
            </div>
            <p>
              <strong>Username:</strong> [username]<br />
              <strong>Password:</strong> [password]
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold mt-2">
              Mulai Test
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Email ini dikirim secara otomatis oleh sistem AssesHub.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
