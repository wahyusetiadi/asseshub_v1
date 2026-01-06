import { Test } from "@/app/(admin)/tests/page";
import Link from "next/link";
import { BsEye, BsTrash2 } from "react-icons/bs";
import { CgFileAdd } from "react-icons/cg";
import { FiEdit3 } from "react-icons/fi";

interface TestCardProps {
  test: Test;
  onView: (test: Test) => void;
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
    <div className="bg-white p-5 rounded-xl border shadow-sm hover:border-blue-300 transition-all group">
      <div className=" flex items-center justify-between">
        <h3 className="font-bold text-lg mb-1 text-black group-hover:text-blue-600">
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

      <p className="text-sm text-gray-500 mb-4">
        {test.totalQuestions|| 0} Pertanyaan • {test.durationMinutes} Menit
      </p>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex gap-3">
          <Link
            href={`/tests/${test.id}`}
            className="text-gray-400 hover:text-green-600"
            title="Tambah Pertanyaan"
          >
            <CgFileAdd size={18} />
          </Link>
          <button
            onClick={() => onView(test)}
            className="text-gray-400 hover:text-blue-600"
            title="Lihat Detail"
          >
            <BsEye size={18} />
          </button>
          <button
            onClick={() => onDelete(test.id)}
            className="text-gray-400 hover:text-red-600"
            title="Hapus"
          >
            <BsTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
