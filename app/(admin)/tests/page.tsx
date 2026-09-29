"use client";
import adminService from "@/app/api/services/adminService";
import examService from "@/app/api/services/examService";
import DeleteConfirmModal from "@/components/Tests/DeleteConfirmModal";
import EditTestModal from "@/components/Tests/EditTestModal";
import PositionAddModal from "@/components/Tests/PositionAddModal";
import TestCard from "@/components/Tests/TestCard";
import TestDetailModal from "@/components/Tests/TestModalDetail";
import ActionButton from "@/components/ui/ActionButton";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import DataTable, { Column } from "@/components/ui/DataTable";
import { useAlert } from "@/hooks/useAlert";
import { AlertState } from "@/types/alert.types";
import { Position } from "@/types/api/position.api";
import { TestApi } from "@/types/api/test.api";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { FaPlus } from "react-icons/fa";

export default function TestPage() {
  const [activeTab, setActiveTab] = useState<"exams" | "positions">("exams");
  const [tests, setTests] = useState<TestApi[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<TestApi | null>(null);
  const [editTest, setEditTest] = useState<TestApi | null>(null);
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

  const { alert, showAlert, closeAlert } = useAlert();

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
        const response = await examService.deleteExam(deleteId.id);
        setTests(tests.filter((t) => t.id !== deleteId.id));
        console.log(response);
        
      } else {
        // await positionService.deletePosition(deleteId.id);
        setPositions(positions.filter((p) => p.id !== deleteId.id));
      }
      setDeleteId(null);
      showAlert({
        variant: "success",
        title: "Berhasil",
        message: "Berhasil menghapus ujian",
      });
    } catch (error) {
      console.error("error deleted:", error);

      showAlert({
        variant: "error",
        title: "Gagal",
        message: "Gagal menghapus Ujian",
      });
    }

    // showAlert({
    //   variant: "warning",
    //   title: "Informasi",
    //   message: "Delete Belum ada",
    // });
    // setDeleteId(null);
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
            // onClick={() => setPositionModal({ isOpen: true, data: pos })}
            onClick={() =>
              showAlert({
                variant: "info",
                title: "Info",
                message: "Edit belum tersedia",
              })
            }
          />
          <ActionButton
            icon={BiTrash}
            tooltip="Hapus"
            // onClick={() => setDeleteId({ id: pos.id, type: "position" })}
            onClick={() =>
              showAlert({
                variant: "info",
                title: "Info",
                message: "Hapus belum tersedia",
              })
            }
            variant="danger"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {alert.show && (
        <div className="fixed top-5 md:right-5 z-9999">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            onClose={closeAlert}
            className="w-80 md:w-90"
          />
        </div>
      )}
      {/* Header & Tab Navigation */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-600">Assessment</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen Ujian
          </h1>
          <div className="mt-4 flex gap-2">
            <Button
              title="Daftar Ujian"
              onClick={() => setActiveTab("exams")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "exams"
                  ? "rounded-xl bg-indigo-50 text-indigo-700"
                  : "rounded-xl text-slate-500 hover:bg-slate-50 hover:text-indigo-700"
              }`}
            />
            <Button
              title="Daftar Posisi"
              onClick={() => setActiveTab("positions")}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === "positions"
                  ? "rounded-xl bg-indigo-50 text-indigo-700"
                  : "rounded-xl text-slate-500 hover:bg-slate-50 hover:text-indigo-700"
              }`}
            />
          </div>
        </div>

        <div className="flex gap-3">
          {activeTab === "exams" ? (
            <Link
              href="/tests/create"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <FaPlus /> Buat Tes Baru
            </Link>
          ) : (
            <Button
              title="Tambah Posisi"
              variant="primary"
              onClick={() => setPositionModal({ isOpen: true, data: null })}
              leftIcon={<FaPlus />}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center shadow-sm">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Memuat data...</p>
        </div>
      ) : activeTab === "exams" ? (
        /* GRID EXAMS */
        tests.length === 0 ? (
          <EmptyState message="Belum ada ujian. Buat ujian baru untuk memulai." />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
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
          onSuccess={(updated) => {
            setTests((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t)),
            );
            showAlert({
              variant: "success",
              title: "Berhasil",
              message: "Ujian berhasil diperbarui",
            });
          }}
          onError={(message) =>
            showAlert({
              variant: "error",
              title: "Gagal",
              message,
            })
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
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <p className="font-medium text-slate-500">{message}</p>
    </div>
  );
}
