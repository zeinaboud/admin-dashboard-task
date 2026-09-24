"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
  Activity,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError("");

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result || result.error) {
        setServerError(
          "Invalid email or password. Please check your credentials and try again.",
        );
        return;
      }

      router.push("/dashboard");
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        {/* =====================================================
            LEFT SIDE
        ====================================================== */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:block">
          {/* Background glow */}
          <div className="absolute inset-0">
            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-violet-500/20 blur-3xl" />

            <div className="absolute left-1/2 top-0 h-full w-px bg-white/[0.04]" />

            <div className="absolute left-[12%] top-[20%] h-px w-[76%] bg-white/[0.05]" />

            <div className="absolute left-[18%] top-[68%] h-px w-[62%] bg-white/[0.05]" />

            <div className="absolute left-[18%] top-[20%] h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_25px_rgba(129,140,248,0.9)]" />

            <div className="absolute right-[20%] top-[38%] h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_20px_rgba(167,139,250,0.9)]" />
          </div>

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-10 xl:p-14">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 shadow-xl">
                <span className="text-lg font-black">A</span>
              </div>

              <div>
                <p className="text-sm font-bold tracking-[0.08em] text-white">
                  ALMAHY
                </p>

                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-500">
                  Admin Platform
                </p>
              </div>
            </div>

            {/* Center */}
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                Workspace is operational
              </div>

              <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white xl:text-6xl">
                Welcome back.
                <br />
                <span className="text-slate-500">Your workspace is ready.</span>
              </h1>

              <p className="mt-7 max-w-lg text-base leading-7 text-slate-400">
                Access your workspace, monitor activity, and keep your team
                operations moving from one centralized platform.
              </p>

              {/* Dashboard mini preview */}
              <div className="relative mt-12 max-w-xl">
                <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
                  {/* Window header */}
                  <div className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                      <span className="h-2 w-2 rounded-full bg-white/20" />
                    </div>

                    <div className="h-2 w-24 rounded-full bg-white/10" />

                    <div className="h-7 w-7 rounded-full bg-white/10" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <MiniStat
                      icon={<Users className="h-3.5 w-3.5" />}
                      label="Users"
                      value="1,284"
                    />

                    <MiniStat
                      icon={<Activity className="h-3.5 w-3.5" />}
                      label="Activity"
                      value="8,492"
                    />

                    <MiniStat
                      icon={<BarChart3 className="h-3.5 w-3.5" />}
                      label="Growth"
                      value="+18.4%"
                    />
                  </div>

                  {/* Chart */}
                  <div className="mt-2 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <div className="h-2 w-24 rounded-full bg-white/20" />
                        <div className="mt-2 h-1.5 w-16 rounded-full bg-white/10" />
                      </div>

                      <div className="h-7 w-20 rounded-lg bg-white/5" />
                    </div>

                    <div className="flex h-24 items-end gap-2">
                      {[32, 48, 42, 65, 54, 72, 62, 86, 78, 94, 82, 100].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-md bg-white/[0.13] transition-all"
                            style={{
                              height: `${height}%`,
                            }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating security card */}
                <div className="absolute -bottom-5 -right-5 hidden w-48 rounded-xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur-xl xl:block">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-white">
                        Secure access
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-500">
                        Protected workspace
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>© 2026 Almahy Platform</span>

              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                All systems operational
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-md">
            {/* Mobile brand */}
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                <span className="text-lg font-black">A</span>
              </div>

              <div>
                <p className="text-sm font-bold tracking-[0.08em]">ALMAHY</p>

                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-400">
                  Admin Platform
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-9">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <h2 className="text-3xl font-bold tracking-[-0.035em] text-slate-950">
                Sign in to your workspace
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your credentials to access your account.
              </p>
            </div>

            {/* Error */}
            {serverError && (
              <div
                role="alert"
                className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5"
              >
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <p className="text-sm leading-5 text-red-700">{serverError}</p>
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    disabled={isSubmitting}
                    {...register("email")}
                    className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Password
                  </label>

                  <Link
                    href="#"
                    className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    {...register("password")}
                    className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                        : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember */}
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 accent-indigo-600 focus:ring-indigo-500"
                />

                <span className="text-sm text-slate-500">
                  Keep me signed in
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition duration-200 hover:bg-slate-800 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Access info */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Access is managed by your administrator
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    New accounts are provisioned by authorized administrators.
                  </p>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Secure authentication
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-[10px]">{label}</span>
      </div>

      <p className="text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
