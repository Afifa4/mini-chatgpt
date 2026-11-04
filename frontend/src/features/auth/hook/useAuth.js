import { useDispatch } from "react-redux";
import {
  register,
  login,
  getMe,
  logout,
  resendVerification,
  forgotPassword,
  resetPassword,
} from "../services/auth.api.js";
import { setUser, setLoading, setError } from "../services/auth.slice.js";
import { resetChat } from "../../chat/service/chat.slice.js";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      await register({ username, email, password });
      return true;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await login({
        email,
        password,
      });
      dispatch(setUser(data.user));
      return true;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || error.message));
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch {
      dispatch(setUser(null));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message,
      );
    } finally {
      dispatch(setUser(null));
      dispatch(resetChat());
    }
  }

  async function handleResendVerification({ email }) {
    try {
      const data = await resendVerification({ email });
      return { ok: true, message: data.message };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Email could not be sent",
      };
    }
  }

  async function handleForgotPassword({ email }) {
    try {
      const data = await forgotPassword({ email });
      return { ok: true, message: data.message };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Email could not be sent",
      };
    }
  }

  async function handleResetPassword({ token, password }) {
    try {
      const data = await resetPassword({ token, password });
      // Old sessions stop working after a password change
      dispatch(setUser(null));
      dispatch(resetChat());
      return { ok: true, message: data.message };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Password could not be reset",
      };
    }
  }

  return {
    handleGetMe,
    handleLogin,
    handleRegister,
    handleLogout,
    handleResendVerification,
    handleForgotPassword,
    handleResetPassword,
  };
}
