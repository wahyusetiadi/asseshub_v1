"use client";
import InvitationConfig from "@/components/invitations/InvitationConfig";
import InvitationStats from "@/components/invitations/InvitationStats";
import SuccessNotification from "@/components/invitations/SuccessNotification";
import adminService from "@/app/api/services/adminService";
import { Candidate, Test } from "@/types/candidateTypes";
import { useEffect, useState } from "react";
import examService from "@/app/api/services/examService";
import SearchBar from "@/components/ui/Searchbar";
import CandidateTable from "@/components/invitations/Candidatetable";

export default function InvitationsPage() {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch candidates data
  const fetchCandidatesData = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getAllCandicates();
      if (response.data?.success) {
        const data = response.data.data;
        setCandidates(data);
      }
    } catch (error) {
      console.error("Error fetch candidates:", error);
      alert("Gagal mengambil data kandidat");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tests data
  const fetchTestsData = async () => {
    try {
      const response = await examService.getAllExams();
      if (response.data?.success) {
        const data = response.data.data;
        setTests(data);
      }
    } catch (error) {
      console.error("Error fetch tests:", error);
      alert("Gagal mengambil data test");
    }
  };

  useEffect(() => {
    fetchCandidatesData();
    fetchTestsData();
  }, []);

  const handleSelectCandidate = (id: string) => {
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
      const requestData = {
        examId: selectedTest,
        userIds: selectedCandidates,
      };

      const response = await adminService.sendInvitation(requestData);

      if (response.data?.success) {
        setSendSuccess(true);
        console.log("Invitations sent:", response.data);

        // Refresh candidates data to get updated status
        await fetchCandidatesData();

        setTimeout(() => {
          setSendSuccess(false);
          setSelectedCandidates([]);
          setSelectedTest("");
          setScheduleDate("");
          setScheduleTime("");
        }, 3000);
      } else {
        throw new Error("Failed to send invitations");
      }
    } catch (error) {
      console.error("Send invitation error:", error);
      alert("Gagal mengirim undangan. Silakan coba lagi.");
    } finally {
      setIsSending(false);
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Success Notification */}
      <SuccessNotification
        show={sendSuccess}
        candidatesCount={selectedCandidates.length}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Kirim Undangan Test
        </h1>
        <p className="text-sm text-gray-500">
          Kirim email undangan test ke kandidat yang dipilih
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Candidate List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari nama atau email kandidat..."
          />

          {/* Candidates Table */}
          <CandidateTable
            candidates={filteredCandidates}
            selectedCandidates={selectedCandidates}
            onSelectCandidate={handleSelectCandidate}
            onSelectAll={handleSelectAll}
            isLoading={isLoading}
          />
        </div>

        {/* Sidebar - Configuration */}
        <div className="lg:col-span-1 space-y-6">
          {/* Invitation Configuration */}
          <InvitationConfig
            tests={tests}
            selectedTest={selectedTest}
            onSelectTest={setSelectedTest}
            scheduleDate={scheduleDate}
            scheduleTime={scheduleTime}
            onDateChange={setScheduleDate}
            onTimeChange={setScheduleTime}
            selectedCandidatesCount={selectedCandidates.length}
            isSending={isSending}
            onSendInvitations={handleSendInvitations}
          />

          {/* Stats Card */}
          <InvitationStats candidates={candidates} />
        </div>
      </div>
    </div>
  );
}