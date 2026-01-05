import { FiAlertTriangle } from "react-icons/fi";
import Button from "../ui/Button";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ onCancel, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg max-w-sm w-full">
        <div className="p-8 text-center">
          <FiAlertTriangle size={32} className="mx-auto text-red-500" />
          <h3 className="font-bold text-xl mt-4">Hapus Ujian?</h3>
          <p className="text-sm text-gray-500 mt-2">
            Data akan dihapus permanen.
          </p>
        </div>
        <hr />
        <div className="w-full items-center justify-between p-4 bg-gray-50 flex gap-3 rounded-lg">
          <Button
            title="Batal"
            variant="outline"
            className="w-full"
            onClick={onCancel}
          />
          <Button
            title="Hapus"
            variant="destructive"
            onClick={onConfirm}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
