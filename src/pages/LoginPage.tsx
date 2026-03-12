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
    <section className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold tracking-tight">Login</h2>
      <p className="mt-1 text-sm text-slate-600">
        Use any non-empty username and password.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
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
