"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login, sendRegisterOtp, verifyRegisterOtp } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "student" as "student" | "teacher",
  });
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
    }) => {
      return login(payload.email, payload.password);
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/dashboard");
    },
    onError: () => {
      setError("Email ve ya sifre sehvdir.");
    },
  });

  const sendOtpMutation = useMutation({
    mutationFn: async (email: string) => sendRegisterOtp(email),
    onSuccess: (data) => {
      setOtpStep(true);
      setSuccess("OTP kod emailinize gonderildi.");
      setDevOtp(data.devOtp || "");
    },
    onError: () => {
      setError("OTP gonderilemedi. Emaili yoxlayin.");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: () => verifyRegisterOtp({ ...registerData, otp: otpCode }),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/dashboard");
    },
    onError: () => {
      setError("OTP yanlisdir ve ya vaxti bitib.");
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);

    if (mode === "login") {
      loginMutation.mutate({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
      });
      return;
    }

    if (!otpStep) {
      const nextRegisterData = {
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        role: String(formData.get("role") || "student") as "student" | "teacher",
        phone: String(formData.get("phone") || ""),
      };
      setRegisterData(nextRegisterData);
      sendOtpMutation.mutate(nextRegisterData.email);
      return;
    }

    verifyOtpMutation.mutate();
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <div className="card border-[var(--brand)]/20">
        <div className="mb-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setOtpStep(false);
              setError("");
              setSuccess("");
            }}
            className={mode === "login" ? "btn-primary" : "btn-secondary"}
          >
            Daxil ol
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setOtpStep(false);
              setError("");
              setSuccess("");
            }}
            className={mode === "register" ? "btn-primary" : "btn-secondary"}
          >
            Qeydiyyat
          </button>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          {mode === "register" && !otpStep && (
            <>
              <input className="input" name="name" placeholder="Ad ve soyad" required />
              <input className="input" name="phone" placeholder="Telefon (optional)" />
              <select className="input" name="role" defaultValue="student">
                <option value="student">Telebe</option>
                <option value="teacher">Muellim</option>
              </select>
            </>
          )}

          {mode === "register" && otpStep ? (
            <>
              <input className="input bg-black/5" value={registerData.email} disabled readOnly />
              <input
                className="input"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Email OTP kodu"
                maxLength={6}
                required
              />
            </>
          ) : (
            <>
              <input className="input" name="email" type="email" placeholder="Email" required />
              <input className="input" name="password" type="password" placeholder="Sifre" required />
            </>
          )}

          <button
            className="btn-primary w-full"
            type="submit"
            disabled={loginMutation.isPending || sendOtpMutation.isPending || verifyOtpMutation.isPending}
          >
            {loginMutation.isPending || sendOtpMutation.isPending || verifyOtpMutation.isPending
              ? "Gozleyin..."
              : mode === "login"
                ? "Daxil ol"
                : otpStep
                  ? "Qeydiyyati tamamla"
                  : "OTP gonder"}
          </button>

          {success && <p className="text-sm text-green-700">{success}</p>}
          {error && <p className="text-sm text-red-700">{error}</p>}
          {devOtp && <p className="text-xs text-[var(--ink-soft)]">DEV OTP: {devOtp}</p>}
          <p className="text-xs text-[var(--ink-soft)]">Demo login: student@example.com / 123456</p>
        </form>
      </div>
    </main>
  );
}
