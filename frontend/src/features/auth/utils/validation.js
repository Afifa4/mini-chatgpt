const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PASSWORD_MIN_LENGTH = 6;

function validateEmail(email) {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_PATTERN.test(email.trim())) return "Enter a valid email address.";
  return "";
}

function validatePassword(password) {
  if (!password) return "Password is required.";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  return "";
}

const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

function validateUsername(username) {
  const value = username.trim();
  if (!value) return "Username is required.";
  if (value.length < 3 || value.length > 30) {
    return "Username must be 3–30 characters.";
  }
  if (!USERNAME_PATTERN.test(value)) {
    return "Only letters, numbers and underscore allowed.";
  }
  return "";
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password.";
  if (confirmPassword !== password) return "Passwords do not match.";
  return "";
}

/** Drops fields without an error, so an empty object means the form is valid. */
function compact(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg));
}

export function validateLogin({ email, password }) {
  return compact({
    email: validateEmail(email),
    password: password ? "" : "Password is required.",
  });
}

export function validateForgotPassword({ email }) {
  return compact({ email: validateEmail(email) });
}

export function validateResetPassword({ password, confirmPassword }) {
  return compact({
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  });
}

export function validateRegister({
  username,
  email,
  password,
  confirmPassword,
}) {
  return compact({
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  });
}
