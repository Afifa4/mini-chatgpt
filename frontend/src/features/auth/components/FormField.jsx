import { useId, useState } from "react";

function EyeIcon({ open }) {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {!open && <path d="M3 3l18 18" />}
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 6zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function FormField({ label, type = "text", error, ...inputProps }) {
  const id = useId();
  const errorId = `${id}-error`;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const stateClasses = error
    ? "border-red-500/80 focus:border-red-500 focus:ring-red-500/20"
    : "border-[#424242] focus:border-[#10a37f] focus:ring-[#10a37f]/20";

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-[#ececec]">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`h-10 w-full rounded-lg border bg-[#212121] px-3.5 text-[15px] text-[#ececec] outline-none transition-shadow placeholder:text-[#8e8e8e] focus:ring-4 ${
            isPassword ? "pr-10" : ""
          } ${stateClasses}`}
          {...inputProps}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-[#8e8e8e] transition-colors hover:text-[#ececec] focus-visible:text-[#ececec] focus-visible:outline-none"
          >
            <EyeIcon open={showPassword} />
          </button>
        )}
      </div>

      {error && (
        <p id={errorId} role="alert" className="mt-1 flex items-center gap-1.5 text-[13px] text-red-400">
          <ErrorIcon />
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
