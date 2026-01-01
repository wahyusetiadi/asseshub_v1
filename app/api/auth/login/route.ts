import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ✅ Admin login
    if (email === "admin@mail.com" && password === "admin123") {
      return NextResponse.json({
        success: true,
        data: {
          token: "mock_jwt_token_admin",
          user: {
            id: 1,
            name: "Admin User",
            email: "admin@asseshub.com",
            role: "admin",
          },
        },
        message: "Login Berhasil",
      });
    }

    // ✅ User login (candidate)
    if (email === "user@mail.com" && password === "user123") {
      return NextResponse.json({
        success: true,
        data: {
          token: "mock_jwt_token_user_john",
          user: {
            id: 2,
            name: "John Doe",
            email: "john@example.com",
            role: "user",
          },
        },
        message: "Login Berhasil",
      });
    }

    if (email === "user2@mail.com" && password === "user123") {
      return NextResponse.json({
        success: true,
        data: {
          token: "mock_jwt_token_user_jane",
          user: {
            id: 3,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
          },
        },
        message: "Login Berhasil",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Email atau password salah",
      },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}
