import { useState } from "react";
import { validateLogin } from "../utils/validation.js";
import FormField from "./FormField.jsx";
import SubmitButton from "./SubmitButton.jsx";
import ResendVerification from "./ResendVerification.jsx";
import { useAuth } from "../hook/useAuth.js";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setError } from "../services/auth.slice.js";

// Must match the message sent by loginUser in auth.controller.js
const UNVERIFIED_EMAIL_ERROR =
  "Please verify your email address before logging in";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setError(null));
  }, []);

  const { handleLogin } = useAuth();
  const { user, error, loading } = useSelector((state) => state.auth);

  async function handleSubmit(e) {
    e.preventDefault();

    //validation check
    const result = validateLogin({ email, password });
    setErrors(result);
    if (Object.keys(result).length > 0) return;

    const payload = {
      email,
      password,
    };

    const ok = await handleLogin(payload);
    if (!ok) return;
    navigate("/");

    setEmail("");
    setPassword("");
  }

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-3">
      <form noValidate onSubmit={handleSubmit} className="space-y-3">
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
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="-mt-1 flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[#10a37f] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        {error && (
          <p
            role="alert"
            className="rounded-lg  px-3 py-2 text-[13px] text-red-400"
          >
            {error}
          </p>
        )}

        <SubmitButton>{loading ? "Logging in..." : "Log in"}</SubmitButton>
      </form>

      {error === UNVERIFIED_EMAIL_ERROR && (
        <ResendVerification email={email} />
      )}
    </div>
  );
}

export default LoginForm;
