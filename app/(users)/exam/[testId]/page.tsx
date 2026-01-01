"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { BiTime, BiCheckCircle } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface ExamData {
  id: number;
  title: string;
  duration: number;
  questions: Question[];
}

export default function ExamExecutionPage({
  params,
}: {
  params: Promise<{ testId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [exam, setExam] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchExam(resolvedParams.testId);
  }, [resolvedParams.testId]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const fetchExam = async (testId: string) => {
    // Mock exam data
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockExam: ExamData = {
      id: Number(testId),
      title: "Software Engineering Assessment",
      duration: 90,
      questions: [
        {
          id: 1,
          text: "Apa kepanjangan dari HTML?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Home Tool Markup Language",
            "Hyperlinks and Text Markup Language",
          ],
          correctAnswer: 0,
        },
        {
          id: 2,
          text: "Bahasa pemrograman mana yang digunakan untuk React?",
          options: ["Python", "Java", "JavaScript", "C++"],
          correctAnswer: 2,
        },
        {
          id: 3,
          text: "Apa fungsi dari CSS?",
          options: [
            "Membuat logika program",
            "Styling tampilan web",
            "Mengelola database",
            "Membuat API",
          ],
          correctAnswer: 1,
        },
        {
          id: 4,
          text: "Apa itu Git?",
          options: [
            "Bahasa pemrograman",
            "Framework JavaScript",
            "Version control system",
            "Database",
          ],
          correctAnswer: 2,
        },
        {
          id: 5,
          text: "HTTP status code 404 artinya?",
          options: ["Server Error", "Not Found", "Forbidden", "Unauthorized"],
          correctAnswer: 1,
        },
        {
          id: 6,
          text: "Apa itu API?",
          options: [
            "Application Programming Interface",
            "Advanced Programming Integration",
            "Automated Process Interaction",
            "Application Process Interface",
          ],
          correctAnswer: 0,
        },
        {
          id: 7,
          text: "Framework JavaScript mana yang dikembangkan oleh Facebook?",
          options: ["Angular", "Vue", "React", "Svelte"],
          correctAnswer: 2,
        },
        {
          id: 8,
          text: "Apa fungsi dari useState di React?",
          options: [
            "Fetch data dari API",
            "Manage component state",
            "Route navigation",
            "Style component",
          ],
          correctAnswer: 1,
        },
        {
          id: 9,
          text: "Database SQL termasuk jenis database?",
          options: ["NoSQL", "Relational", "Document", "Graph"],
          correctAnswer: 1,
        },
        {
          id: 10,
          text: "Apa kepanjangan dari JSON?",
          options: [
            "JavaScript Object Notation",
            "Java Syntax Object Network",
            "JavaScript Online Network",
            "Java System Object Notation",
          ],
          correctAnswer: 0,
        },
      ],
    };

    setExam(mockExam);
    setTimeRemaining(mockExam.duration * 60);
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!exam) return;
    setAnswers({
      ...answers,
      [exam.questions[currentQuestionIndex].id]: optionIndex,
    });
  };

  const handleNext = () => {
    if (!exam || currentQuestionIndex >= exam.questions.length - 1) return;
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex <= 0) return;
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleSubmit = async () => {
    if (!exam) return;

    const unansweredCount = exam.questions.length - Object.keys(answers).length;

    if (unansweredCount > 0) {
      if (
        !confirm(
          `Masih ada ${unansweredCount} soal yang belum dijawab. Apakah Anda yakin ingin submit?`
        )
      ) {
        return;
      }
    } else {
      if (!confirm("Apakah Anda yakin ingin submit test?")) {
        return;
      }
    }

    setIsSubmitting(true);

    // Calculate score
    let correctCount = 0;
    exam.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / exam.questions.length) * 100);

    // TODO: Send to API and get resultId
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockResultId = Date.now(); // Mock result ID

    console.log("Test submitted:", {
      testId: exam.id,
      resultId: mockResultId,
      answers,
      score,
      correctCount,
      totalQuestions: exam.questions.length,
    });

    // Redirect to result page with resultId
    router.push(`/result-exam/${mockResultId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
              <p className="text-sm text-gray-500">
                Soal {currentQuestionIndex + 1} dari {exam.questions.length}
              </p>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
                timeRemaining < 300 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              <BiTime size={20} />
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border shadow-sm p-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">
                  Pertanyaan #{currentQuestionIndex + 1}
                </span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentQuestion.text}</h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition ${
                      answers[currentQuestion.id] === index
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === index
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {answers[currentQuestion.id] === index && (
                          <BiCheckCircle className="text-white" size={16} />
                        )}
                      </div>
                      <span className="font-medium text-gray-700">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <BsArrowLeft size={18} />
                  Sebelumnya
                </button>

                {currentQuestionIndex < exam.questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Selanjutnya
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
                  >
                    {isSubmitting ? "Mengirim..." : "Submit Test"}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Navigasi Soal</h3>
              <p className="text-sm text-gray-500 mb-4">
                {answeredCount} dari {exam.questions.length} soal terjawab
              </p>

              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`aspect-square rounded-lg font-semibold text-sm transition ${
                      currentQuestionIndex === index
                        ? "bg-blue-600 text-white"
                        : answers[question.id] !== undefined
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  💡 <span className="font-semibold">Tips:</span> Pastikan semua soal sudah
                  terjawab sebelum submit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
