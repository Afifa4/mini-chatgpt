import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });

  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", { email, password });

  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}

export async function forgotPassword({ email }) {
  const response = await api.post("/api/auth/forgot-password", { email });
  return response.data;
}

export async function resetPassword({ token, password }) {
  const response = await api.post("/api/auth/reset-password", {
    token,
    password,
  });
  return response.data;
}

export async function resendVerification({ email }) {
  const response = await api.post("/api/auth/resend-verification", { email });
  return response.data;
}
