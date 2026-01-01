/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

const mockTests = [
  {
    id: 1,
    title: "Software Engineering Assessment",
    description: "Test untuk mengukur kemampuan software engineering",
    duration: 90,
    questions: 50,
    passingScore: 70,
    status: "active",
    createdAt: "2024-01-10T08:00:00Z",
  },
  {
    id: 2,
    title: "Product Management Test",
    description: "Test untuk product manager",
    duration: 60,
    questions: 30,
    passingScore: 75,
    status: "active",
    createdAt: "2024-01-12T10:00:00Z",
  },
];

// GET - List all tests
export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: mockTests,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data test",
      },
      { status: 500 }
    );
  }
}

// POST - Create new test
export async function POST(request: Request) {
  try {
    const body = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newTest = {
      id: mockTests.length + 1,
      ...body,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    mockTests.push(newTest);

    return NextResponse.json(
      {
        success: true,
        data: newTest,
        message: "Test berhasil dibuat",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat test",
      },
      { status: 500 }
    );
  }
}
