import { useState } from "react";
import FormField from "./FormField.jsx";
import { useAuth } from "../hook/useAuth.js";

/* Pass email when it is already known; otherwise the user types it here */
function ResendVerification({ email: knownEmail }) {
  const [typedEmail, setTypedEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);
  const { handleResendVerification } = useAuth();

  const email = knownEmail ?? typedEmail;

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setResult(null);
    const data = await handleResendVerification({ email });
    setResult(data);
    setIsSending(false);
  }

  if (result?.ok) {
    return (
      <p role="status" className="text-center text-[13px] text-[#10a37f]">
        {result.message} Please check your spam folder too.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {knownEmail === undefined && (
        <FormField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          value={typedEmail}
          onChange={(e) => setTypedEmail(e.target.value)}
        />
      )}

      {result && (
        <p role="alert" className="text-[13px] text-red-400">
          {result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSending}
        className="h-10 w-full rounded-lg border border-[#10a37f] text-sm font-medium text-[#10a37f] transition-colors hover:bg-[#10a37f]/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSending ? "Sending..." : "Resend verification email"}
      </button>
    </form>
  );
}

export default ResendVerification;
