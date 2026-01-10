"use client";
import React from "react";
import { BiEnvelope, BiInfoCircle } from "react-icons/bi";
import { BsSend } from "react-icons/bs";
import TestSelector from "./TestSelector";
import SchedulePicker from "./SchedulePicker";
import { Test } from "@/types/candidateTypes";

interface InvitationConfigProps {
  tests: Test[];
  selectedTest: string;
  onSelectTest: (testId: string) => void;
  scheduleDate: string;
  scheduleTime: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  selectedCandidatesCount: number;
  isSending: boolean;
  onSendInvitations: () => void;
}

export default function InvitationConfig({
  tests,
  selectedTest,
  onSelectTest,
  scheduleDate,
  scheduleTime,
  onDateChange,
  onTimeChange,
  selectedCandidatesCount,
  isSending,
  onSendInvitations,
}: InvitationConfigProps) {
  const isDisabled = isSending || !selectedTest || selectedCandidatesCount === 0;

  return (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-6 space-y-5 sticky top-6">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <BiEnvelope className="text-blue-600" size={20} />
        Konfigurasi Undangan
      </h3>

      {/* Select Test */}
      <TestSelector
        tests={tests}
        selectedTest={selectedTest}
        onSelectTest={onSelectTest}
      />

      <hr />

      {/* Schedule */}
      <SchedulePicker
        scheduleDate={scheduleDate}
        scheduleTime={scheduleTime}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
      />

      <hr />

      {/* Email Preview Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-2">
          <BiInfoCircle
            className="text-yellow-600 shrink-0 mt-0.5"
            size={18}
          />
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
        onClick={onSendInvitations}
        disabled={isDisabled}
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
            Kirim Undangan ({selectedCandidatesCount})
          </>
        )}
      </button>
    </div>
  );
}