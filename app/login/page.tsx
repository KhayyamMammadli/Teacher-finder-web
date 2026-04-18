"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login, register } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async (payload: {
      name?: string;
      email: string;
      password: string;
      role?: "student" | "teacher";
      phone?: string;
    }) => {
      if (mode === "login") {
        return login(payload.email, payload.password);
      }
      return register({
        name: payload.name || "",
        email: payload.email,
        password: payload.password,
        role: payload.role || "student",
        phone: payload.phone,
      });
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      router.push("/dashboard");
    },
    onError: () => {
      setError("Auth failed. Check credentials.");
    },
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      role: String(formData.get("role") || "student") as "student" | "teacher",
      phone: String(formData.get("phone") || ""),
    };

    mutation.mutate(payload);
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <div className="card">
        <div className="mb-5 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={mode === "login" ? "btn-primary" : "btn-secondary"}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={mode === "register" ? "btn-primary" : "btn-secondary"}
          >
            Register
          </button>
        </div>

        <form className="space-y-3" onSubmit={onSubmit}>
          {mode === "register" && <input className="input" name="name" placeholder="Full name" required />}
          <input className="input" name="email" type="email" placeholder="Email" required />
          <input className="input" name="password" type="password" placeholder="Password" required />

          {mode === "register" && (
            <>
              <input className="input" name="phone" placeholder="Phone (optional)" />
              <select className="input" name="role" defaultValue="student">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </>
          )}

          <button className="btn-primary w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <p className="text-xs text-[var(--ink-soft)]">Demo: student@example.com / 123456</p>
        </form>
      </div>
    </main>
  );
}
