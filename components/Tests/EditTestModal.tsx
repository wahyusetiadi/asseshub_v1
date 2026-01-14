"use client";

import examService from "@/app/api/services/examService";
import { useEffect, useState } from "react";
import SelectField from "../ui/SelectField";
import adminService from "@/app/api/services/adminService";
import { Test } from "@/types/testTypes";
import { Position } from "@/types/positions.type";
import InputField from "../ui/InputFieled";
import Button from "../ui/Button";

interface Props {
  test: Test;
  onClose: () => void;
  onSuccess?: (updated: Test) => void;
}

export default function EditTestModal({ test, onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: 0,
    startAt: "",
    endAt: "",
    categoryId: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  const fetchPositionData = async () => {
    try {
      const response = await adminService.getAllPositions();
      const data = response.data?.data || response.data || [];
      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
    }
  };

  // Fetch positions saat modal dibuka
  useEffect(() => {
    fetchPositionData();
  }, []);

  // Set form setelah positions ter-load
  useEffect(() => {
    if (positions.length > 0) {
      // Cari position yang match dengan category name
      const matchedPosition = positions.find(
        (pos) => pos.name.toLowerCase() === test.category?.toLowerCase()
      );

      setForm({
        title: test.title,
        description: test.description,
        durationMinutes: test.durationMinutes,
        startAt: test.startAt.slice(0, 16),
        endAt: test.endAt.slice(0, 16),
        categoryId: matchedPosition?.id || "",
        category: test.category || "",
      });
    }
  }, [test, positions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "durationMinutes" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedPosition = positions.find((pos) => pos.id === selectedId);

    setForm((prev) => ({
      ...prev,
      categoryId: selectedId,
      category: selectedPosition?.name || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (new Date(form.startAt) >= new Date(form.endAt)) {
        alert("❌ Waktu selesai harus lebih besar dari waktu mulai");
        return;
      }

      const payload = {
        title: form.title,
        description: form.description,
        startAt: form.startAt,
        endAt: form.endAt,
        durationMinutes: form.durationMinutes,
        categoryId: form.categoryId,
      };

      await examService.updateExam(test.id, payload);

      const updated: Test = {
        ...test,
        ...payload,
        category: form.category, // ✅ Update category juga
        startAt: new Date(payload.startAt).toISOString(),
        endAt: new Date(payload.endAt).toISOString(),
      };

      onSuccess?.(updated);
      onClose();
      alert("✅ Ujian berhasil diperbarui");
    } catch (error) {
      console.error("Update exam error:", error);
      alert("❌ Gagal memperbarui ujian");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Edit Ujian</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Judul"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <SelectField
            label="Posisi"
            placeholder="-- Pilih Posisi --"
            options={positions.map((pos) => ({
              label: pos.name,
              value: pos.id,
            }))}
            value={form.categoryId}
            onChange={handleSelectChange}
            required
            helperText="Pilih Posisi yang dialamar kandidat"
          />

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Deskripsi
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>

          <InputField
            label="Durasi (menit)"
            type="number"
            name="durationMinutes"
            value={form.durationMinutes}
            onChange={handleChange}
            min={1}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Mulai"
              type="datetime-local"
              name="startAt"
              value={form.startAt}
              onChange={handleChange}
              required
            />
            <InputField
              label="Selesai"
              type="datetime-local"
              name="endAt"
              value={form.endAt}
              onChange={handleChange}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              title="Batal"
              onClick={onClose}
              variant="outline"
            />
            <Button
              type="submit"
              title={loading ? "Menyimpan..." : "Simpan Perubahan"}
              disabled={loading}
              variant="primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
