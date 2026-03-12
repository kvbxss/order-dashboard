import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuthStore } from "../domains/auth/model/auth.store";

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
    <section className="mx-auto max-w-md rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)] p-6 shadow-[0_14px_32px_rgba(24,18,12,0.08)]">
      <h2 className="text-3xl font-bold tracking-tight">Login</h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">
        Use any non-empty username and password.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-[var(--border-soft)] bg-white px-3 py-2 outline-none transition focus:border-[var(--accent)]"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-[var(--border-soft)] bg-white px-3 py-2 outline-none transition focus:border-[var(--accent)]"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--accent-contrast)] transition hover:brightness-95"
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
