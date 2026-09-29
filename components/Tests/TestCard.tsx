import { TestApi } from "@/types/api/test.api";
import { Test } from "@/types/testTypes";
import Link from "next/link";
import { BsEye, BsTrash2 } from "react-icons/bs";
import { CgFileAdd } from "react-icons/cg";
import { FiEdit3 } from "react-icons/fi";

interface TestCardProps {
  test: TestApi;
  onView: (test: TestApi) => void;
  onDelete: (id: string) => void;
  onEditExam: (id: string) => void;
}

export default function TestCard({
  test,
  onView,
  onDelete,
  onEditExam,
}: TestCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/[0.05]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <CgFileAdd size={20} />
        </div>
        <h3 className="flex-1 pt-1 text-lg font-bold leading-6 text-slate-900 transition group-hover:text-indigo-700">
          {test.title}
        </h3>
        <button
          onClick={() => onEditExam(test.id)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
          title="Edit Pertanyaan"
        >
          <FiEdit3 size={16} />
        </button>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        {test.totalQuestions|| 0} Pertanyaan • {test.durationMinutes} Menit
      </p>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex gap-2">
          <Link
            href={`/tests/${test.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
            title="Tambah Pertanyaan"
          >
            <CgFileAdd size={18} />
          </Link>
          <button
            onClick={() => onView(test)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
            title="Lihat Detail"
          >
            <BsEye size={18} />
          </button>
          <button
            onClick={() => onDelete(test.id)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            title="Hapus"
          >
            <BsTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
