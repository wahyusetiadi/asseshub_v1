"use client";
import adminService from "@/app/api/services/adminService";
import examService from "@/app/api/services/examService";
import DeleteConfirmModal from "@/components/Tests/DeleteConfirmModal";
import EditTestModal from "@/components/Tests/EditTestModal";
import PositionAddModal from "@/components/Tests/PositionAddModal";
import TestCard from "@/components/Tests/TestCard";
import TestDetailModal from "@/components/Tests/TestModalDetail";
import ActionButton from "@/components/ui/ActionButton";
import Button from "@/components/ui/Button";
import DataTable, { Column } from "@/components/ui/DataTable";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPlus, BiPencil, BiTrash } from "react-icons/bi";

export interface Position {
  id: string;
  name: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  startAt: string;
  endAt: string;
  totalQuestions?: number;
  categoryId?: string;
  category?: string;
  _count?: { questions: number };
}

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<"exams" | "positions">("exams");
  const [tests, setTests] = useState<Test[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [editTest, setEditTest] = useState<Test | null>(null);
  const [deleteId, setDeleteId] = useState<{
    id: string;
    type: "exam" | "position";
  } | null>(null);

  const [positionModal, setPositionModal] = useState<{
    isOpen: boolean;
    data: Position | null;
  }>({
    isOpen: false,
    data: null,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "exams") {
        const res = await examService.getAllExams();
        setTests(Array.isArray(res) ? res : res?.data?.data || res?.data || []);
      } else {
        const res = await adminService.getAllPositions();
        console.log("position:", res.data.data);

        setPositions(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      if (deleteId.type === "exam") {
        // await examService.deleteExam(deleteId.id);
        setTests(tests.filter((t) => t.id !== deleteId.id));
      } else {
        // await positionService.deletePosition(deleteId.id);
        setPositions(positions.filter((p) => p.id !== deleteId.id));
      }
      setDeleteId(null);
      alert("✅ Berhasil dihapus");
    } catch (error) {
      alert("❌ Gagal menghapus");
    }
  };

  // Definisi kolom untuk tabel posisi
  const positionColumns: Column<Position>[] = [
    {
      key: "name",
      label: "Nama Posisi",
      align: "left",
    },
    {
      key: "actions",
      label: "Aksi",
      align: "right",
      render: (pos) => (
        <div className="flex justify-end gap-2">
          <ActionButton
            icon={BiPencil}
            tooltip="Edit"
            onClick={() => setPositionModal({ isOpen: true, data: pos })}
          />
          <ActionButton
            icon={BiTrash}
            tooltip="Hapus"
            onClick={() => setDeleteId({ id: pos.id, type: "position" })}
            variant="danger"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Tab Navigation */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-gray-200 pb-2">
        <div>
          <h1 className="text-2xl font-bold text-black">Manajemen Rekrutmen</h1>
          <div className="flex gap-6 mt-4">
            <button
              onClick={() => setActiveTab("exams")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "exams"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Daftar Ujian
            </button>
            <button
              onClick={() => setActiveTab("positions")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "positions"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-blue-600"
              }`}
            >
              Daftar Posisi
            </button>
          </div>
        </div>

        <div className="flex gap-3 pb-2">
          {activeTab === "exams" ? (
            <Link
              href="/tests/create"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm text-sm"
            >
              <BiPlus size={18} /> Buat Tes Baru
            </Link>
          ) : (
            <Button
              title="Tambah Posisi"
              variant="primary"
              onClick={() => setPositionModal({ isOpen: true, data: null })}
              leftIcon={<BiPlus />}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-500 mt-4">Memuat data...</p>
        </div>
      ) : activeTab === "exams" ? (
        /* GRID EXAMS */
        tests.length === 0 ? (
          <EmptyState message="Belum ada ujian. Buat ujian baru untuk memulai." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test) => (
              <TestCard
                key={test.id}
                test={test}
                onDelete={() => setDeleteId({ id: test.id, type: "exam" })}
                onView={() => setSelectedTest(test)}
                onEditExam={() => setEditTest(test)}
              />
            ))}
          </div>
        )
      ) : (
        /* TABLE POSITIONS - Menggunakan DataTable Component */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <DataTable
            columns={positionColumns}
            data={positions}
            isLoading={false}
            emptyMessage="Belum ada data posisi."
          />
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Test Modals */}
      {selectedTest && (
        <TestDetailModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}
      {editTest && (
        <EditTestModal
          test={editTest}
          onClose={() => setEditTest(null)}
          onSuccess={(updated) =>
            setTests((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t))
            )
          }
        />
      )}

      {/* Position Modal (Handle Add & Edit) */}
      <PositionAddModal
        isOpen={positionModal.isOpen}
        onClose={() => setPositionModal({ isOpen: false, data: null })}
        onSuccess={() => {
          fetchData(); // Refresh data setelah simpan
          setPositionModal({ isOpen: false, data: null });
        }}
      />

      {/* Global Delete Modal */}
      {deleteId && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

// Helper Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
