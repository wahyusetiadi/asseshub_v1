import { FiAlertTriangle } from "react-icons/fi";
import Button from "../ui/Button";

interface DeleteCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

export default function DeleteCandidateModal({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: DeleteCandidateModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg max-w-sm w-full mx-4 md:mx-0">
        <div className="p-8 text-center border-b border-slate-300">
          <FiAlertTriangle size={32} className="mx-auto text-red-500" />
          <h3 className="font-bold text-xl mt-4">Hapus Kandidat?</h3>
          <p className="text-sm text-gray-500 mt-2">
            Data akan dihapus permanen.
          </p>
        </div>

        <div className="w-full items-center justify-between p-4 bg-gray-50 flex gap-3 rounded-lg">
          <Button
            title="Batal"
            variant="outline"
            className="w-full"
            onClick={onClose}
          />
          <Button
            title="Hapus"
            variant="destructive"
            onClick={onSuccess}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
