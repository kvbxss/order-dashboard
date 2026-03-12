import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../store/auth.store";
import { ui } from "../styles/ui";

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const state = location.state as LocationState | undefined;
  const redirectTo = state?.from?.pathname ?? "/dashboard";

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const success = login(username, password);
    if (!success) {
      setError("Enter both username and password.");
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <section
      className={`mx-auto max-w-md ${ui.panel} p-6 shadow-[0_14px_32px_rgba(24,18,12,0.08)]`}
    >
      <h2 className="text-3xl font-bold tracking-tight">Login</h2>
      <p className={ui.leadText}>
        Use any non-empty username and password.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full ${ui.formInput}`}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full ${ui.formInput}`}
        />

        <button
          type="submit"
          className={`w-full ${ui.buttonPrimary}`}
        >
          Sign in
        </button>

        {error ? (
          <p className="text-sm text-red-600" role="status">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
}
