"use client";
import { useState } from 'react';
import Link from 'next/link';
import { BiPlusCircle, BiSave } from 'react-icons/bi';
import { BsArrowLeft, BsTrash2 } from 'react-icons/bs';

export default function CreateTestPage() {
  const [questions, setQuestions] = useState([{ id: 1, text: '', options: ['', '', '', ''], correct: 0 }]);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: ['', '', '', ''], correct: 0 }]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/tests" className="p-2 hover:bg-gray-100 rounded-full transition"><BsArrowLeft size={20} /></Link>
        <h1 className="text-2xl font-bold text-gray-800">Buat Tes Baru</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Konten Utama */}
        <div className="lg:col-span-2 space-y-6">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-white p-6 rounded-xl border-l-4 border-l-blue-500 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Pertanyaan #{index + 1}</span>
                <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-600 p-1"><BsTrash2 size={18} /></button>
              </div>
              <textarea 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" 
                placeholder="Tuliskan soal di sini..." 
                rows={3}
              />
              <div className="grid gap-3">
                {['A', 'B', 'C', 'D'].map((label, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <input type="radio" name={`correct-${q.id}`} className="w-4 h-4 text-blue-600" />
                    <input type="text" placeholder={`Opsi ${label}`} className="flex-1 p-2 border rounded-md text-sm" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={addQuestion} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-2 transition-all">
            <BiPlusCircle size={20} /> Tambah Pertanyaan Baru
          </button>
        </div>

        {/* Sidebar Pengaturan */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Durasi (Menit)</label>
              <input type="number" defaultValue={60} className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password Ujian (Opsional)</label>
              <input type="text" placeholder="TOKEN123" className="w-full p-2 border rounded-md" />
            </div>
            <hr />
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg transition">
              <BiSave size={18} /> Simpan Ujian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}