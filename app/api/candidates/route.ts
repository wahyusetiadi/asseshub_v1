import { NextResponse } from "next/server";
import { Candidate, CreateCandidateRequest } from "@/types/api";

// ✅ Initial mock data
const initialCandidates: Candidate[] = [
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
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane@example.com",
    phone: "081298765432",
    position: "Product Manager",
    username: "jane_smith",
    password: "Pass456!",
    status: "sent",
    createdAt: "2024-01-16T14:20:00Z",
  },
  {
    id: 3,
    fullName: "Michael Johnson",
    email: "michael@example.com",
    phone: "081212345678",
    position: "UI/UX Designer",
    username: "michael_j",
    password: "Pass789!",
    status: "pending",
    createdAt: "2024-01-17T09:15:00Z",
  },
  {
    id: 4,
    fullName: "Sarah Williams",
    email: "sarah@example.com",
    phone: "081387654321",
    position: "Data Analyst",
    username: "sarah_w",
    password: "Pass101!",
    status: "opened",
    createdAt: "2024-01-18T11:45:00Z",
  },
];

// ✅ Mutable store
const candidatesStore: Candidate[] = [...initialCandidates];

// GET - List all candidates
export async function GET(request: Request) {
  try {
    console.log("🔵 GET /api/candidates called");
    console.log("📦 candidatesStore length:", candidatesStore.length);
    console.log("📦 candidatesStore data:", candidatesStore);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    console.log("🔍 Search params:", { search, page, limit });

    await new Promise((resolve) => setTimeout(resolve, 300));

    let filtered = candidatesStore;
    if (search) {
      filtered = candidatesStore.filter(
        (c) =>
          c.fullName.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
      );
      console.log("🔍 Filtered results:", filtered.length);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtered.slice(startIndex, endIndex);

    console.log("📄 Paginated data:", paginatedData.length, "items");

    const response = {
      success: true,
      data: paginatedData,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };

    console.log("✅ Sending response:", response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("❌ GET /api/candidates error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data kandidat",
      },
      { status: 500 }
    );
  }
}

// POST - Create new candidate
export async function POST(request: Request) {
  try {
    console.log("🔵 POST /api/candidates called");

    const body: CreateCandidateRequest = await request.json();
    console.log("📝 Request body:", body);

    const { fullName, email, phone, position, password } = body;

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!fullName || !email) {
      console.log("❌ Validation failed: missing fullName or email");
      return NextResponse.json(
        {
          success: false,
          message: "Nama dan email wajib diisi",
        },
        { status: 400 }
      );
    }

    const existing = candidatesStore.find((c) => c.email === email);
    if (existing) {
      console.log("❌ Email already exists:", email);
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar",
        },
        { status: 400 }
      );
    }

    const newCandidate: Candidate = {
      id: candidatesStore.length > 0 
        ? Math.max(...candidatesStore.map(c => c.id)) + 1 
        : 1,
      fullName,
      email,
      phone: phone || "",
      position: position || "",
      username: email.split("@")[0],
      password: password || `Pass${Math.random().toString(36).slice(-8)}!`,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    candidatesStore.push(newCandidate);

    console.log("✅ New candidate added:", newCandidate);
    console.log("📦 Total candidates now:", candidatesStore.length);

    return NextResponse.json(
      {
        success: true,
        data: newCandidate,
        message: "Kandidat berhasil ditambahkan",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ POST /api/candidates error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menambahkan kandidat",
      },
      { status: 500 }
    );
  }
}
