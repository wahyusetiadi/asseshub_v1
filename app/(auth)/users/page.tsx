"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputFieled";
import authService from "@/app/api/services/authService";
import { FaEye, FaUser } from "react-icons/fa";
import { RiInformationLine } from "react-icons/ri";

const FormInput = [
  {
    label: "Username",
    type: "text",
    placeholder: "username",
    name: "username",
    icon: <FaUser />,
  },
  {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    name: "password",
    icon: <FaEye />,
  },
];

export default function AuthPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1️⃣ Login → dapat token
      await authService.loginUser(formData.username, formData.password);

      // 2️⃣ Hit getMe pakai token
      const meResponse = await authService.getMe();
      const user = meResponse.data;

      // 3️⃣ Simpan user (opsional)
      localStorage.setItem("user", JSON.stringify(user));

      // 4️⃣ Redirect berdasarkan role
      if (user.role === "ADMIN") {
        router.push("/admin-dashboard");
      } else if (user.role === "USER") {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Username atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white text-black">
      <div className="bg-white p-8 border border-slate-300 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Portal Peserta Ujian
        </h1>
        <p className="text-center mb-4 text-xs text-slate-500">
          Selamat datang! Masukkan username dan password yang Anda terima untuk
          memulai tes.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full grid gap-4">
          {FormInput.map((input) => (
            <InputField
              key={input.label}
              label={input.label}
              leftIcon={input.icon}
              type={input.type}
              placeholder={input.placeholder}
              name={input.name}
              value={formData[input.name as keyof typeof formData]}
              onChange={handleChange}
              required
            />
          ))}

          <Button
            type="submit"
            title={isLoading ? "Loading..." : "Login"}
            variant="primary"
            className="w-full"
            disabled={isLoading}
          />
        </form>
        <div className="flex items-center gap-3 px-4 py-2 mt-4 bg-amber-50 border border-amber-200 rounded-lg shadow-sm">
          <RiInformationLine className="text-amber-600 shrink-0" size={20} />
          <p className="text-xs text-amber-800 font-medium">
            Pastikan koneksi internet stabil sebelum Anda masuk ke ruang ujian.
          </p>
        </div>
      </div>
    </div>
  );
}
