import { Link, useSearchParams } from "react-router-dom";
import ResendVerification from "../components/ResendVerification.jsx";

const CONTENT = {
  success: {
    icon: "ri-checkbox-circle-fill",
    color: "text-[#10a37f]",
    title: "Email verified!",
    message:
      "Your email has been verified. You can now log in to your account.",
  },
  error: {
    icon: "ri-error-warning-fill",
    color: "text-[#f87171]",
    title: "Verification failed",
    message:
      "This link is invalid or has expired. Enter your email to get a new one.",
  },
};

function EmailVerifiedPage() {
  // URL se ?status=success ya ?status=error padhna
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") === "success" ? "success" : "error";
  const content = CONTENT[status];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] px-4 text-[#ececec]">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#3a3a3a] bg-[#2f2f2f] px-6 py-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.35)] sm:px-8">
        <i className={`${content.icon} ${content.color} text-6xl`}></i>

        <h1 className="mt-3 text-xl font-semibold">{content.title}</h1>
        <p className="mt-2 text-sm text-[#b4b4b4]">{content.message}</p>

        {status === "error" && (
          <div className="mt-6 text-left">
            <ResendVerification />
          </div>
        )}

        <Link
          to="/login"
          className="mt-6 block w-full rounded-full bg-white py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#d9d9d9]"
        >
          Go to Log in
        </Link>
      </div>
    </div>
  );
}

export default EmailVerifiedPage;
