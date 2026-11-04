import { validateRegister, PASSWORD_MIN_LENGTH } from "../utils/validation.js";
import FormField from "./FormField.jsx";
import SubmitButton from "./SubmitButton.jsx";
import ResendVerification from "./ResendVerification.jsx";
import { useAuth } from "../hook/useAuth.js";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../services/auth.slice.js";

function RegisterForm() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [registeredEmail, setRegisteredEmail] = useState(null);
  const dispatch = useDispatch();
  const { handleRegister } = useAuth();

  useEffect(() => {
    dispatch(setError(null));
  }, []);

  const { error, loading } = useSelector((state) => state.auth);

  async function handleSubmit(e) {
    e.preventDefault();

    // validation check
    const values = { username, email, password, confirmPassword };
    const result = validateRegister(values);
    setErrors(result);
    if (Object.keys(result).length > 0) return;

    const payload = { username, email, password };
    const ok = await handleRegister(payload);
    if (!ok) {
      return;
    }

    setRegisteredEmail(email.trim());
    setPassword("");
    setConfirmPassword("");
  }

  if (registeredEmail) {
    return (
      <div className="space-y-4 text-center">
        <i
          className="ri-mail-send-line text-5xl text-[#10a37f]"
          aria-hidden="true"
        ></i>
        <div role="status">
          <h2 className="text-lg font-semibold">Check your email</h2>
          <p className="mt-2 text-sm text-[#b4b4b4]">
            We sent a verification link to{" "}
            <span className="font-medium text-[#ececec]">
              {registeredEmail}
            </span>
            . Open it to verify your account, then log in.
          </p>
          <p className="mt-2 text-xs text-[#8e8e8e]">
            The link expires in 24 hours. Didn&apos;t get it? Check your spam
            folder or send it again.
          </p>
        </div>

        <ResendVerification email={registeredEmail} />

        <Link
          to="/login"
          replace
          className="block w-full rounded-lg bg-[#10a37f] py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[#0e8f6f]"
        >
          Go to Log in
        </Link>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-3">
      <FormField
        label="Username"
        placeholder="Your username"
        autoComplete="name"
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        error={errors.username}
      />
      <FormField
        label="Email address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <FormField
        label="Password"
        type="password"
        placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <FormField
        label="Confirm password"
        type="password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[13px] text-red-400"
        >
          {error}
        </p>
      )}

      <div className="pt-1">
        <SubmitButton>
          {loading ? "Creating account..." : "Create account"}
        </SubmitButton>
      </div>
    </form>
  );
}

export default RegisterForm;
