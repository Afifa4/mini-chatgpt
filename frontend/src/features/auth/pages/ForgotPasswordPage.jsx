import { useState } from "react";
import { Link } from "react-router-dom";
import FormField from "../components/FormField.jsx";
import SubmitButton from "../components/SubmitButton.jsx";
import { useAuth } from "../hook/useAuth.js";
import { validateForgotPassword } from "../utils/validation.js";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);
  const { handleForgotPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSending) return;

    const validationErrors = validateForgotPassword({ email });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSending(true);
    setResult(null);
    const data = await handleForgotPassword({ email });
    setResult(data);
    setIsSending(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] px-4 text-[#ececec] [color-scheme:dark]">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#3a3a3a] bg-[#2f2f2f] px-6 py-8 shadow-[0_12px_32px_rgba(0,0,0,0.35)] sm:px-8">
        <h1 className="text-center text-xl font-semibold">
          Forgot your password?
        </h1>
        <p className="mt-2 text-center text-sm text-[#b4b4b4]">
          Enter your email and we will send you a reset link.
        </p>

        {result?.ok ? (
          <p
            role="status"
            className="mt-6 text-center text-[13px] text-[#10a37f]"
          >
            {result.message} Please check your spam folder too.
          </p>
        ) : (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="mt-6 space-y-3"
          >
            <FormField
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            {result && (
              <p role="alert" className="text-[13px] text-red-400">
                {result.message}
              </p>
            )}

            <SubmitButton>
              {isSending ? "Sending..." : "Send reset link"}
            </SubmitButton>
          </form>
        )}

        <Link
          to="/login"
          className="mt-4 block text-center text-sm font-medium text-[#10a37f] hover:underline"
        >
          Back to Log in
        </Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
