import { NextResponse } from "next/server";
import { Candidate, UpdateCandidateRequest } from "@/types/api";

const mockCandidates: Candidate[] = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john@example.com",
    phone: "081234567890",
    position: "Software Engineer",
    username: "john_doe",
    password: "Pass123!",
    status: "pending",
    createdAt: "2024-01-15T10:30:00Z",
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidateId = parseInt(id);
    const candidate = mockCandidates.find((c) => c.id === candidateId);

    if (!candidate) {
      return NextResponse.json(
        {
          success: false,
          message: "Kandidat tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data kandidat",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidateId = parseInt(id);
    const body: UpdateCandidateRequest = await request.json();

    const index = mockCandidates.findIndex((c) => c.id === candidateId);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Kandidat tidak ditemukan",
        },
        { status: 404 }
      );
    }

    mockCandidates[index] = { ...mockCandidates[index], ...body };

    return NextResponse.json({
      success: true,
      data: mockCandidates[index],
      message: "Kandidat berhasil diupdate",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupdate kandidat",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidateId = parseInt(id);
    const index = mockCandidates.findIndex((c) => c.id === candidateId);

    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Kandidat tidak ditemukan",
        },
        { status: 404 }
      );
    }

    mockCandidates.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: "Kandidat berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus kandidat",
      },
      { status: 500 }
    );
  }
}
