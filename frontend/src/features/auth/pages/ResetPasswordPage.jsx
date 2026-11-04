import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FormField from "../components/FormField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import { useAuth } from "../hook/useAuth.js";
import { PASSWORD_MIN_LENGTH, validateResetPassword } from "../utils/validation.js";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState(null);
  const { handleResetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSaving) return;

    const validationErrors = validateResetPassword({
      password,
      confirmPassword,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    setResult(null);
    const data = await handleResetPassword({ token, password });
    setResult(data);
    setIsSaving(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] px-4 text-[#ececec] [color-scheme:dark]">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#3a3a3a] bg-[#2f2f2f] px-6 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.35)] sm:px-8">
        <h1 className="text-center text-xl font-semibold">
          Set a new password
        </h1>

        {result?.ok ? (
          <>
            <p
              role="status"
              className="mt-4 text-center text-sm text-[#10a37f]"
            >
              {result.message}
            </p>
            <Link
              to="/login"
              className="mt-6 block w-full rounded-full bg-white py-2.5 text-center text-sm font-medium text-black transition-colors hover:bg-[#d9d9d9]"
            >
              Go to Log in
            </Link>
          </>
        ) : !token ? (
          <>
            <p role="alert" className="mt-4 text-center text-sm text-red-400">
              This reset link is invalid or has expired.
            </p>
            <Link
              to="/forgot-password"
              className="mt-6 block text-center text-sm font-medium text-[#10a37f] hover:underline"
            >
              Request a new link
            </Link>
          </>
        ) : (
          <>
            <form
              noValidate
              onSubmit={handleSubmit}
              className="mt-6 space-y-3"
            >
              <FormField
                label="New password"
                type="password"
                placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <FormField
                label="Confirm new password"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />

              {result && (
                <p role="alert" className="text-[13px] text-red-400">
                  {result.message}
                </p>
              )}

              <SubmitButton>
                {isSaving ? "Saving..." : "Reset password"}
              </SubmitButton>
            </form>

            {result && (
              <Link
                to="/forgot-password"
                className="mt-4 block text-center text-sm font-medium text-[#10a37f] hover:underline"
              >
                Request a new link
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
