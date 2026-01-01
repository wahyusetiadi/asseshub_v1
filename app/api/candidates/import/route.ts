import { NextResponse } from "next/server";
import { Candidate } from "@/types/api";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "File CSV tidak ditemukan",
        },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const text = await file.text();
    const lines = text.split("\n");

    const candidates: Candidate[] = lines.slice(1).map((line, index) => {
      const values = line.split(",");
      return {
        id: Date.now() + index,
        fullName: values[0]?.trim() || "",
        email: values[1]?.trim() || "",
        phone: values[2]?.trim() || "",
        position: values[3]?.trim() || "",
        username: values[1]?.split("@")[0] || "",
        password: `Pass${Math.random().toString(36).slice(-8)}!`,
        status: "pending" as const,
        createdAt: new Date().toISOString(),
      };
    }).filter(c => c.fullName && c.email);

    return NextResponse.json({
      success: true,
      data: candidates,
      message: `Berhasil import ${candidates.length} kandidat`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal import kandidat",
      },
      { status: 500 }
    );
  }
}
