"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputFieled";
import authService from "@/app/api/services/authService";

const FormInput = [
  {
    label: "Username",
    type: "text",
    placeholder: "username",
    name: "username",
  },
  {
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    name: "password",
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
      await authService.loginAdmin(formData.username, formData.password);

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
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">AssesHub</h1>

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

        <p className="text-xs text-gray-500 text-center mt-4">Demo:</p>
        <ul className="text-xs text-gray-500 text-center mt-4">
          <li>admin@mail.com / admin123</li>
          <li>user@mail.com / user123</li>
        </ul>
      </div>
    </div>
  );
}
