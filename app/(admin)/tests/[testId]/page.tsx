"use client";

import examService from "@/app/api/services/examService";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsArrowLeft, BsQuestionCircle } from "react-icons/bs";
import { BiPlus } from "react-icons/bi";
import QuestionCard, { Question } from "@/components/Tests/QuestionCard";
import DeleteConfirmationModal from "@/components/Tests/DeleteConfirmationModal";
import { TestBase, TestWithQuestions } from "@/types/testTypes";
import Button from "@/components/ui/Button";

export default function EditTestPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.testId as string;

  const [testData, setTestData] = useState<TestBase>({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    durationMinutes: 120,
    categoryId: "",
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        let examDetail: TestBase | null = null;
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
          categoryId: examDetail.categoryId || "",
        });

        // 2️⃣ Fetch exam WITH questions menggunakan getQuestion(examId)
        const examWithQuestionsResponse = await examService.getQuestion(examId);

        let examWithQuestions: TestWithQuestions | null = null;
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

        const transformedQuestions: Question[] =
          examWithQuestions.questions.map((q, index) => ({
            id: index + 1,
            dbId: q.id,
            text: q.text,
            options: q.options
              .slice(0, 5) // ⛔ jaga-jaga kalau BE kirim >5
              .map((opt) => ({
                id: opt.id,
                text: opt.text,
                isCorrect: opt.isCorrect,
              })),
          }));

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
        await examService.updateQuestion(question.dbId, question.text);

        for (const option of question.options) {
          if (!option.text.trim()) continue;

          if (option.id) {
            await examService.updateOption(option.id, {
              text: option.text,
              isCorrect: option.isCorrect,
            });
          } else {
            await examService.createOptions(question.dbId, {
              text: option.text,
              isCorrect: option.isCorrect,
            });
          }
        }

        alert("✅ Soal berhasil diperbarui!");
      } else {
        const qResponse = await examService.createQuestion(
          examId,
          question.text
        );
        const questionId = qResponse?.data?.data?.id || qResponse?.data?.id;

        if (!questionId) {
          throw new Error("ID question tidak ditemukan dalam response");
        }

        for (const option of question.options) {
          if (!option.text.trim()) continue;

          await examService.createOptions(questionId, {
            text: option.text,
            isCorrect: option.isCorrect,
          });
        }

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
      ],
    };

    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleAddOption = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? q.options.length >= 5
            ? q
            : {
                ...q,
                options: [...q.options, { text: "", isCorrect: false }],
              }
          : q
      )
    );
  };

  const handleRemoveOption = (questionId: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        if (q.options.length <= 2) return q;

        const newOptions = q.options.filter((_, i) => i !== optIndex);

        // jaga kalau yang dihapus adalah jawaban benar
        const hasCorrect = newOptions.some((o) => o.isCorrect);
        if (!hasCorrect && newOptions.length > 0) {
          newOptions[0].isCorrect = true;
        }

        return { ...q, options: newOptions };
      })
    );
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
    setDeleteQuestionId(null);
  };

  const updateQuestionText = (id: number, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/tests"
              className="p-2 bg-white hover:bg-gray-100 rounded-full transition border border-slate-300 shadow-sm"
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

        <div className="">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Daftar Soal</h2>
              <p className="text-sm text-gray-500">
                Tambah dan kelola soal ujian
              </p>
            </div>

            <Button
              title="Tambah Soal"
              onClick={handleAddQuestion}
              leftIcon={<BiPlus size={18} />}
              variant="primary"
            />
          </div>

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
                  onAddOption={handleAddOption}
                  onRemoveOption={handleRemoveOption}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
