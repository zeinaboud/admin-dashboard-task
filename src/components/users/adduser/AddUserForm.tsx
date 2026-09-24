"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Edit3,
  Loader2,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  addUserStep1Schema,
  addUserStep2Schema,
  addUserStep3Schema,
  addUserSchema,
  type AddUserInput,
} from "@/validation/users/add-user-validation";
import { useCreateUser } from "./hooks/useCreateUser";

const steps = [
  {
    number: 1,
    title: "Basic Information",
    description: "Personal details",
  },
  {
    number: 2,
    title: "Role & Access",
    description: "Permissions and security",
  },
  {
    number: 3,
    title: "Review",
    description: "Confirm information",
  },
];

export function AddUserForm() {
  const router = useRouter();
  const createUser = useCreateUser();

  const [currentStep, setCurrentStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<AddUserInput>({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      role: "USER",
      status: "ACTIVE",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    getValues,
    setError,
    formState: { errors },
  } = form;

  const validateStep1 = () => {
    const data = getValues();

    console.log("Step 1 data:", data);

    const result = addUserStep1Schema.safeParse({
      name: data.name,
      email: data.email,
      phone: data.phone,
      department: data.department,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;

      if (errors.name?.[0]) {
        setError("name", {
          type: "manual",
          message: errors.name[0],
        });
      }

      if (errors.email?.[0]) {
        setError("email", {
          type: "manual",
          message: errors.email[0],
        });
      }

      if (errors.phone?.[0]) {
        setError("phone", {
          type: "manual",
          message: errors.phone[0],
        });
      }

      if (errors.department?.[0]) {
        setError("department", {
          type: "manual",
          message: errors.department[0],
        });
      }

      return;
    }

    console.log("Step 1 valid");

    setCurrentStep(2);
  };

  const validateStep2 = async () => {
    const values = getValues();

    const result = addUserStep2Schema.safeParse({
      role: values.role,
      status: values.status,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    if (result.success) {
      setCurrentStep(3);
      return;
    }

    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof AddUserInput;

      setError(field, {
        type: "manual",
        message: issue.message,
      });
    });
  };

  const handleCreateUser = async () => {
    const values = getValues();

    const result = addUserStep3Schema.safeParse({
      termsAccepted,
    });

    if (!result.success) {
      setError("termsAccepted", {
        type: "manual",
        message: "You must confirm the information before creating the user",
      });

      return;
    }

    const finalResult = addUserSchema.safeParse({
      ...values,
      termsAccepted,
    });

    if (!finalResult.success) {
      finalResult.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AddUserInput;

        setError(field, {
          type: "manual",
          message: issue.message,
        });
      });

      return;
    }

    try {
      await createUser.mutateAsync({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        department: values.department || undefined,
        role: values.role,
        status: values.status,
        password: values.password,
      });

      setSuccess(true);
    } catch {
      // Error is displayed below the form using createUser.error
    }
  };

  const getFieldError = (field: keyof AddUserInput) => {
    return errors[field]?.message;
  };

  const inputClassName = (field: keyof AddUserInput) =>
    `mt-2 w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
        : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
    }`;

  if (success) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-slate-900">
            User created successfully
          </h1>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {getValues("name")} has been added to your users.
          </p>

          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => router.push("/dashboard/users")}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
            <UserPlus className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add User
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a new user account and configure access.
            </p>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <div key={step.number} className="flex flex-1 items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : step.number}
                  </div>

                  <div className="hidden sm:block">
                    <p
                      className={`text-sm font-semibold ${
                        isActive || isCompleted
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`mx-3 h-px flex-1 ${
                      currentStep > step.number
                        ? "bg-emerald-400"
                        : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="p-5 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter the user&apos;s basic contact information.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-slate-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={inputClassName("name")}
                />

                {getFieldError("name") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {getFieldError("name")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...register("email")}
                  className={inputClassName("email")}
                />

                {getFieldError("email") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {getFieldError("email")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-slate-700"
                >
                  Phone
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <input
                  id="phone"
                  type="tel"
                  placeholder="+971 50 123 4567"
                  {...register("phone")}
                  className={inputClassName("phone")}
                />

                {getFieldError("phone") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {getFieldError("phone")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="text-sm font-medium text-slate-700"
                >
                  Department
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <input
                  id="department"
                  type="text"
                  placeholder="Engineering"
                  {...register("department")}
                  className={inputClassName("department")}
                />

                {getFieldError("department") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {getFieldError("department")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={validateStep1}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="p-5 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Role & Access
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Configure the user&apos;s role, status and password.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="role"
                  className="text-sm font-medium text-slate-700"
                >
                  Role
                </label>

                <select
                  id="role"
                  {...register("role")}
                  className={inputClassName("role")}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>

                {getFieldError("role") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {getFieldError("role")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-slate-700"
                >
                  Status
                </label>

                <select
                  id="status"
                  {...register("status")}
                  className={inputClassName("status")}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="INACTIVE">Inactive</option>
                </select>

                {getFieldError("status") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {getFieldError("status")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  {...register("password")}
                  className={inputClassName("password")}
                />

                {getFieldError("password") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {getFieldError("password")}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  {...register("confirmPassword")}
                  className={inputClassName("confirmPassword")}
                />

                {getFieldError("confirmPassword") && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {getFieldError("confirmPassword")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                onClick={validateStep2}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Review
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="p-5 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Review & Confirm
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review the information before creating the account.
              </p>
            </div>

            <div className="space-y-5">
              {/* Basic information */}
              <div className="rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Basic Information
                  </h3>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-slate-400">Full name</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {getValues("name")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-900">
                      {getValues("email")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {getValues("phone") || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Department</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {getValues("department") || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Access */}
              <div className="rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Role & Access
                  </h3>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400">Role</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {getValues("role") === "ADMIN" ? "Admin" : "User"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {getValues("status")}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Password</p>
                    <p className="mt-1 text-sm font-medium tracking-widest text-slate-900">
                      ••••••••
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(event) => {
                    setTermsAccepted(event.target.checked);

                    if (event.target.checked) {
                      form.clearErrors("termsAccepted");
                    }
                  }}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                />

                <span className="text-sm leading-5 text-slate-600">
                  I confirm that the information provided is accurate and I am
                  authorized to create this user account.
                </span>
              </label>

              {errors.termsAccepted && (
                <p className="text-xs text-red-600">
                  {errors.termsAccepted.message}
                </p>
              )}

              {createUser.isError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {createUser.error instanceof Error
                    ? createUser.error.message
                    : "Failed to create user. Please try again."}
                </div>
              )}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                type="button"
                disabled={createUser.isPending}
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                type="button"
                disabled={createUser.isPending}
                onClick={handleCreateUser}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createUser.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create User
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
