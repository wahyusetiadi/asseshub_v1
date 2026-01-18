// "use client";

// import { useEffect, useState } from "react";
// import Button from "@/components/ui/Button";
// import { Candidate, CandidateStatus } from "@/types/candidateTypes";

// export type CandidateModalMode =
//   | "detail"
//   | "create"
//   | "update"
//   | "delete";

// interface Props {
//   isOpen: boolean;
//   mode: CandidateModalMode;
//   candidate?: Candidate | null;
//   loading?: boolean;

//   onClose: () => void;
//   onCreate?: (payload: Partial<Candidate>) => Promise<void> | void;
//   onUpdate?: (id: string, payload: Partial<Candidate>) => Promise<void> | void;
//   onDelete?: (id: string) => Promise<void> | void;
// }

// const emptyForm: Partial<Candidate> = {
//   name: "",
//   email: "",
//   status: "active",
// };

// export default function Modal({
//   isOpen,
//   mode,
//   candidate,
//   loading = false,
//   onClose,
//   onCreate,
//   onUpdate,
//   onDelete,
// }: Props) {
//   const [form, setForm] = useState<Partial<Candidate>>(emptyForm);

//   /* INIT FORM */
//   useEffect(() => {
//     if (mode === "create") {
//       setForm(emptyForm);
//     }

//     if (mode === "update" && candidate) {
//       setForm({
//         name: candidate.name,
//         email: candidate.email,
//         status: candidate.status,
//       });
//     }
//   }, [mode, candidate]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn">
//       <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl animate-scaleIn">
//         {/* HEADER */}
//         <h2 className="mb-4 text-lg font-bold text-gray-800">
//           {mode === "detail" && "Detail Kandidat"}
//           {mode === "create" && "Tambah Kandidat"}
//           {mode === "update" && "Update Kandidat"}
//           {mode === "delete" && "Hapus Kandidat"}
//         </h2>

//         {/* CONTENT */}
//         {mode === "detail" && candidate && (
//           <DetailView candidate={candidate} />
//         )}

//         {(mode === "create" || mode === "update") && (
//           <FormView form={form} setForm={setForm} />
//         )}

//         {mode === "delete" && candidate && (
//           <DeleteView candidate={candidate} />
//         )}

//         {/* FOOTER */}
//         <div className="mt-6 flex justify-end gap-3">
//           <Button
//             title="Batal"
//             variant="secondary"
//             onClick={onClose}
//           />

//           {mode === "create" && onCreate && (
//             <Button
//               title={loading ? "Menyimpan..." : "Simpan"}
//               variant="primary"
//               disabled={loading}
//               onClick={() => onCreate(form)}
//             />
//           )}

//           {mode === "update" && candidate && onUpdate && (
//             <Button
//               title={loading ? "Memperbarui..." : "Update"}
//               variant="primary"
//               disabled={loading}
//               onClick={() => onUpdate(candidate.id, form)}
//             />
//           )}

//           {mode === "delete" && candidate && onDelete && (
//             <Button
//               title={loading ? "Menghapus..." : "Hapus"}
//               variant="destructive"
//               disabled={loading}
//               onClick={() => onDelete(candidate.id)}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= SUB COMPONENTS ================= */

// function DetailView({ candidate }: { candidate: Candidate }) {
//   return (
//     <div className="space-y-3 text-sm">
//       <Field label="Nama" value={candidate.name} />
//       <Field label="Email" value={candidate.email} />
//       <Field label="Status" value={candidate.status} />
//     </div>
//   );
// }

// function FormView({
//   form,
//   setForm,
// }: {
//   form: Partial<Candidate>;
//   setForm: React.Dispatch<React.SetStateAction<Partial<Candidate>>>;
// }) {
//   return (
//     <div className="space-y-4">
//       <Input
//         label="Nama"
//         value={form.name ?? ""}
//         onChange={(v) => setForm({ ...form, name: v })}
//       />

//       <Input
//         label="Email"
//         value={form.email ?? ""}
//         onChange={(v) => setForm({ ...form, email: v })}
//       />

//       <div>
//         <label className="text-sm font-medium">Status</label>
//         <select
//           className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
//           value={form.status}
//           onChange={(e) =>
//             setForm({ ...form, status: e.target.value as CandidateStatus })
//           }
//         >
//           <option value="active">Aktif</option>
//           <option value="inactive">Nonaktif</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// function DeleteView({ candidate }: { candidate: Candidate }) {
//   return (
//     <p className="text-sm text-gray-600">
//       Apakah kamu yakin ingin menghapus kandidat{" "}
//       <span className="font-semibold">{candidate.name}</span>?
//       <br />
//       <span className="text-red-600">
//         Tindakan ini tidak bisa dibatalkan.
//       </span>
//     </p>
//   );
// }

// /* ================= UI HELPERS ================= */

// function Field({
//   label,
//   value,
// }: {
//   label: string;
//   value?: string;
// }) {
//   return (
//     <div>
//       <p className="text-gray-500">{label}</p>
//       <p className="font-semibold">{value || "-"}</p>
//     </div>
//   );
// }

// function Input({
//   label,
//   value,
//   onChange,
// }: {
//   label: string;
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div>
//       <label className="text-sm font-medium">{label}</label>
//       <input
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
//       />
//     </div>
//   );
// }
