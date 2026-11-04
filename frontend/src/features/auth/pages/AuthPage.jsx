import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

const CONTENT = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to continue to Mini ChatGPT",
    switchText: "Don't have an account?",
    switchAction: "Sign up",
  },
  register: {
    title: "Create your account",
    subtitle: "Sign up to start chatting with Mini ChatGPT",
    switchText: "Already have an account?",
    switchAction: "Log in",
  },
};

const TABS = [
  { mode: "login", label: "Log in" },
  { mode: "register", label: "Sign up" },
];

function Logo() {
  return (
    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[#10a37f] text-white shadow-sm">
      <i className="ri-openai-fill text-3xl"></i>
    </div>
  );
}

function AuthPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mode = pathname === "/register" ? "register" : "login";
  const content = CONTENT[mode];

  const switchTo = (next) => navigate(`/${next}`, { replace: true });

  const toggleMode = () => switchTo(mode === "login" ? "register" : "login");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#212121] px-4 py-6 text-[#ececec] [color-scheme:dark]">
      <div className="w-full max-w-[420px]">
        <div className="rounded-2xl border border-[#3a3a3a] bg-[#2f2f2f] px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.3),0_12px_32px_rgba(0,0,0,0.35)] sm:px-8">
          <Logo />

          <div className="mt-3 text-center">
            <h1 className="text-xl font-semibold tracking-tight">
              {content.title}
            </h1>
            <p className="mt-1 text-sm text-[#b4b4b4]">{content.subtitle}</p>
          </div>

          <div
            role="tablist"
            aria-label="Authentication mode"
            className="mt-4 grid grid-cols-2 rounded-lg bg-[#212121] p-1 text-sm font-medium"
          >
            {TABS.map((tab) => (
              <button
                key={tab.mode}
                type="button"
                role="tab"
                aria-selected={mode === tab.mode}
                onClick={() => switchTo(tab.mode)}
                className={`rounded-md py-1.5 transition-all ${
                  mode === tab.mode
                    ? "bg-[#424242] text-white shadow-sm"
                    : "text-[#8e8e8e] hover:text-[#ececec]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {/* The key resets form values and errors when switching views. */}
            {mode === "login" ? (
              <LoginForm key="login" />
            ) : (
              <RegisterForm key="register" />
            )}
          </div>

          <p className="mt-4 text-center text-sm text-[#b4b4b4]">
            {content.switchText}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-[#10a37f] hover:underline"
            >
              {content.switchAction}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-[#8e8e8e]">
          By continuing, you agree to our{" "}
          <a href="#" className="underline hover:text-[#ececec]">
            Terms
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-[#ececec]">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
