/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

const mockResults = [
  {
    id: 1,
    candidateId: 1,
    candidateName: "John Doe",
    testId: 1,
    testTitle: "Software Engineering Assessment",
    score: 85,
    totalQuestions: 50,
    correctAnswers: 42,
    duration: 85,
    status: "completed",
    completedAt: "2024-01-20T15:30:00Z",
  },
  {
    id: 2,
    candidateId: 2,
    candidateName: "Jane Smith",
    testId: 1,
    testTitle: "Software Engineering Assessment",
    score: 92,
    totalQuestions: 50,
    correctAnswers: 46,
    duration: 78,
    status: "completed",
    completedAt: "2024-01-21T10:15:00Z",
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get("testId");
    const candidateId = searchParams.get("candidateId");

    await new Promise((resolve) => setTimeout(resolve, 500));

    let filtered = mockResults;

    if (testId) {
      filtered = filtered.filter((r) => r.testId === parseInt(testId));
    }

    if (candidateId) {
      filtered = filtered.filter((r) => r.candidateId === parseInt(candidateId));
    }

    return NextResponse.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data hasil test",
      },
      { status: 500 }
    );
  }
}
