"use client";

import examService from "@/app/api/services/examService";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsArrowLeft, BsQuestionCircle } from "react-icons/bs";
import { BiPlus } from "react-icons/bi";
import { TestData } from "@/types/testTypes";
import QuestionCard, { Question } from "@/components/Tests/QuestionCard";
import ExamDetailsForm from "@/components/Tests/ExamDetailsForm";
import DeleteConfirmationModal from "@/components/Tests/DeleteConfirmationModal";

// ✅ Response dari getQuestion(examId) - SUDAH ADA QUESTIONS!
interface ExamWithQuestionsResponse {
  id: string;
  title: string;
  durationMinutes: number;
  questions: Array<{
    id: string;
    text: string;
    options: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
    }>;
  }>;
}

// ✅ Response dari getExamDetail(examId) - HANYA BASIC INFO
interface ExamDetailResponse {
  id: string;
  title: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditTestPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.testId as string;

  const [testData, setTestData] = useState<TestData>({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    durationMinutes: 120,
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingExam, setIsSavingExam] = useState(false);
  const [savingQuestionId, setSavingQuestionId] = useState<number | null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<number | null>(null);

  // ✅ Fetch exam & questions
  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setIsLoading(true);

        // 1️⃣ Fetch exam basic info (untuk form detail - startAt, endAt, description)
        const examDetailResponse = await examService.getExamDetail(examId);

        let examDetail: ExamDetailResponse | null = null;
        if (examDetailResponse?.data?.data) {
          examDetail = examDetailResponse.data.data;
        } else if (examDetailResponse?.data) {
          examDetail = examDetailResponse.data;
        }

        if (!examDetail) {
          throw new Error("Data exam tidak ditemukan");
        }

        // Set exam basic info
        setTestData({
          title: examDetail.title || "",
          description: examDetail.description || "",
          startAt: examDetail.startAt
            ? new Date(examDetail.startAt).toISOString().slice(0, 16)
            : "",
          endAt: examDetail.endAt
            ? new Date(examDetail.endAt).toISOString().slice(0, 16)
            : "",
          durationMinutes: examDetail.durationMinutes || 120,
        });

        // 2️⃣ Fetch exam WITH questions menggunakan getQuestion(examId)
        // ✅ PAKAI EXAM ID, BUKAN QUESTION ID!
        const examWithQuestionsResponse = await examService.getQuestion(examId);

        let examWithQuestions: ExamWithQuestionsResponse | null = null;
        if (examWithQuestionsResponse?.data?.data) {
          examWithQuestions = examWithQuestionsResponse.data.data;
        } else if (examWithQuestionsResponse?.data) {
          examWithQuestions = examWithQuestionsResponse.data;
        }

        if (!examWithQuestions || !examWithQuestions.questions) {
          console.warn("Exam tidak memiliki questions");
          setQuestions([]);
          return;
        }

        // 3️⃣ Transform questions ke format lokal
        const transformedQuestions: Question[] =
          examWithQuestions.questions.map((q, index) => {
            // ✅ Ambil options dari BE
            const existingOptions = q.options.map((opt) => ({
              id: opt.id,
              text: opt.text,
              isCorrect: opt.isCorrect,
            }));

            // ✅ Tambahkan opsi kosong sampai total 5
            const totalOptions = 5;
            const emptyOptionsNeeded = Math.max(
              0,
              totalOptions - existingOptions.length
            );

            const emptyOptions = Array.from(
              { length: emptyOptionsNeeded },
              () => ({
                text: "",
                isCorrect: false,
              })
            );

            // ✅ Gabungkan: options dari BE + options kosong
            const allOptions = [...existingOptions, ...emptyOptions];

            return {
              id: index + 1, // Local UI ID
              dbId: q.id,
              text: q.text,
              options: allOptions,
            };
          });

        setQuestions(transformedQuestions);
      } catch (error) {
        console.error("Error fetching exam:", error);
        alert("❌ Gagal memuat data ujian");
        router.push("/tests");
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) fetchExamData();
  }, [examId, router]);

  // ✅ Update exam info (disabled, belum ada API)
  const handleUpdateExam = async () => {
    try {
      if (!testData.title.trim()) {
        alert("❌ Judul ujian tidak boleh kosong");
        return;
      }
      if (!testData.startAt || !testData.endAt) {
        alert("❌ Mohon tentukan waktu mulai dan selesai");
        return;
      }
      if (new Date(testData.startAt) >= new Date(testData.endAt)) {
        alert("❌ Waktu mulai harus lebih awal dari waktu selesai");
        return;
      }

      setIsSavingExam(true);
      alert(
        "ℹ️ Fitur update exam info belum tersedia. Silakan tunggu update API."
      );
    } catch (error) {
      console.error("Error updating exam:", error);
      alert("❌ Gagal memperbarui info ujian");
    } finally {
      setIsSavingExam(false);
    }
  };

  // ✅ Save individual question
  const handleSaveQuestion = async (question: Question) => {
    try {
      if (!question.text.trim()) {
        alert("❌ Pertanyaan tidak boleh kosong");
        return;
      }

      const validOptions = question.options.filter((opt) => opt.text.trim());
      if (validOptions.length < 2) {
        alert("❌ Minimal 2 opsi jawaban harus diisi");
        return;
      }

      const hasCorrect = question.options.some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        alert("❌ Pilih minimal 1 jawaban yang benar");
        return;
      }

      setSavingQuestionId(question.id);

      if (question.dbId) {
        alert(
          "ℹ️ Fitur update question belum tersedia. Hapus dan buat ulang jika perlu update."
        );
      } else {
        // Create new question
        const qResponse = await examService.createQuestion(
          examId,
          question.text
        );
        const questionId = qResponse?.data?.data?.id || qResponse?.data?.id;

        if (!questionId) {
          throw new Error("ID question tidak ditemukan dalam response");
        }

        // Create options
        for (const option of question.options) {
          if (!option.text.trim()) continue;

          await examService.createOptions(questionId, {
            text: option.text,
            isCorrect: option.isCorrect,
          });
        }

        // Update local state
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === question.id ? { ...q, dbId: questionId } : q
          )
        );

        alert("✅ Soal berhasil ditambahkan!");
      }
    } catch (error) {
      console.error("Error saving question:", error);
      alert("❌ Gagal menyimpan soal");
    } finally {
      setSavingQuestionId(null);
    }
  };

  // ✅ Tambah question baru (local state)
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: "",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQuestion]);
  };

  // ✅ Hapus question
  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
    setDeleteQuestionId(null);
  };

  // ✅ Update question text
  const updateQuestionText = (id: number, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  // ✅ Update option text
  const updateOption = (questionId: number, optIndex: number, text: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) =>
                i === optIndex ? { ...opt, text } : opt
              ),
            }
          : q
      )
    );
  };

  // ✅ Set correct answer
  const setCorrectAnswer = (questionId: number, optIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, i) => ({
                ...opt,
                isCorrect: i === optIndex,
              })),
            }
          : q
      )
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-500 mt-4 font-semibold">
            Memuat data ujian...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/tests"
              className="p-2 bg-white hover:bg-gray-100 rounded-full transition border shadow-sm"
            >
              <BsArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Ujian</h1>
              <p className="text-sm text-gray-500">
                Kelola Detail & Soal Ujian
              </p>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Exam Details */}
          <ExamDetailsForm
            testData={testData}
            setTestData={setTestData}
            onSave={handleUpdateExam}
            isSaving={isSavingExam}
            questionCount={questions.length}
          />

          {/* RIGHT: Questions Editor */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Daftar Soal</h2>
                <p className="text-sm text-gray-500">
                  Tambah dan kelola soal ujian
                </p>
              </div>
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                <BiPlus size={18} />
                Tambah Soal
              </button>
            </div>

            {/* Questions List */}
            {questions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                <BsQuestionCircle
                  size={48}
                  className="mx-auto text-gray-300 mb-4"
                />
                <p className="text-gray-500">
                  Belum ada soal. Klik &quot;Tambah Soal&quot; untuk memulai.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdateText={updateQuestionText}
                    onUpdateOption={updateOption}
                    onSetCorrect={setCorrectAnswer}
                    onDelete={setDeleteQuestionId}
                    onSave={handleSaveQuestion}
                    isSaving={savingQuestionId === question.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteQuestionId !== null}
        onClose={() => setDeleteQuestionId(null)}
        onConfirm={() =>
          deleteQuestionId && handleDeleteQuestion(deleteQuestionId)
        }
      />
    </div>
  );
}
