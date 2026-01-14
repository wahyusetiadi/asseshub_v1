"use client";
import { Test } from "@/types/testTypes";
import React from "react";

interface TestSelectorProps {
  tests: Test[];
  selectedTest: string;
  onSelectTest: (testId: string) => void;
}

export default function TestSelector({
  tests,
  selectedTest,
  onSelectTest,
}: TestSelectorProps) {
  const currentTest = tests.find((t) => t.id === selectedTest);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Pilih Test <span className="text-red-500">*</span>
      </label>
      <select
        value={selectedTest}
        onChange={(e) => onSelectTest(e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
      >
        <option value="">-- Pilih Test --</option>
        {tests.map((test) => (
          <option key={test.id} value={test.id}>
            {test.title}
          </option>
        ))}
      </select>
      {selectedTest && currentTest && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm">
          <p className="text-gray-700">
            <span className="font-semibold">Durasi:</span> {currentTest.durationMinutes}{" "}
            menit
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Soal:</span> {currentTest.totalQuestions}{" "}
            pertanyaan
          </p>
        </div>
      )}
    </div>
  );
}