"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import InputField from "@/components/ui/InputFieled";
import authService from "@/app/api/services/authService";
import {
  clearSession,
  getHomeRouteByRole,
  getStoredToken,
  isTokenExpired,
  setStoredUser,
  type SessionUser,
} from "@/helpers/auth";
import { FaEye, FaUser } from "react-icons/fa";
import { RiInformationLine } from "react-icons/ri";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { DEMO_USER_ACCOUNT, isDemoMode } from "@/helpers/demo";

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
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const syncActiveSession = async () => {
      const token = getStoredToken();

      if (!token || isTokenExpired(token)) {
        clearSession();
        if (isMounted) {
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        const meResponse = await authService.getMe();
        const user = meResponse.data as SessionUser;

        setStoredUser(user);
        router.replace(getHomeRouteByRole(user.role));
      } catch {
        clearSession();
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void syncActiveSession();

    return () => {
      isMounted = false;
    };
  }, [router]);

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
      const user = meResponse.data as SessionUser;

      // 3️⃣ Simpan user (opsional)
      setStoredUser(user);

      // 4️⃣ Redirect berdasarkan role
      router.replace(getHomeRouteByRole(user.role));
    } catch (err) {
      console.error(err);
      setError("Username atau password salah");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-sm text-slate-300">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-2xl backdrop-blur">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-300 border-t-transparent" />
          Memeriksa sesi login...
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 text-slate-900 sm:px-6">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />

      <main className="relative grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-black/30 md:min-h-[620px] md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 p-10 text-white md:flex lg:p-12">
          <div className="absolute -right-24 top-28 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -right-10 top-44 h-44 w-44 rounded-full border border-white/10" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1 shadow-lg">
              <Image src={logo} alt="AssesHub" className="h-full w-full object-contain" />
            </div>
            <span className="text-lg font-bold tracking-wide">AssesHub</span>
          </div>
          <div className="relative max-w-sm">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-indigo-200">
              Candidate portal
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Tunjukkan kemampuan terbaik Anda.
            </h1>
            <p className="mt-5 text-base leading-7 text-indigo-100">
              Masuk untuk melihat ujian yang ditugaskan dan mengerjakannya dengan fokus.
            </p>
            <div className="mt-9 flex items-center gap-3 text-sm text-indigo-100">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">✓</span>
              <span>Jawaban tersimpan saat Anda mengerjakan</span>
            </div>
          </div>
          <p className="relative text-xs text-indigo-200">AssesHub · Assessment platform</p>
        </aside>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 md:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 p-1">
                <Image src={logo} alt="AssesHub" className="h-full w-full object-contain" />
              </div>
              <span className="text-lg font-bold text-slate-900">AssesHub</span>
            </div>

            <div className="mb-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Portal peserta</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-950">Selamat datang</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Masuk menggunakan username dan password yang Anda terima untuk memulai ujian.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <span className="mt-0.5 font-bold">!</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid w-full gap-5">
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
                  size="lg"
                  className="rounded-xl border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-500"
                  containerClassName="space-y-1.5"
                />
              ))}

              <Button
                type="submit"
                title={isLoading ? "Loading..." : "Masuk ke portal"}
                variant="primary"
                className="mt-1 h-12 w-full rounded-xl bg-indigo-600 text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
                disabled={isLoading}
              />
            </form>

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
              <RiInformationLine className="mt-0.5 shrink-0 text-indigo-600" size={18} />
              <p>Pastikan koneksi internet stabil sebelum masuk ke ruang ujian.</p>
            </div>

            {isDemoMode() && (
              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-indigo-950">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-indigo-700">Akun demo kandidat</p>
                <p className="font-mono font-semibold">
                  {DEMO_USER_ACCOUNT.username} / {DEMO_USER_ACCOUNT.password}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
