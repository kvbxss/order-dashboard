import { Routes, Route, Navigate, Link, NavLink } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./domains/auth/model/auth.store";
import DashboardPage from "./pages/DashboardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const username = useAuthStore((state) => state.username);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="mb-8 flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)]/95 p-3 shadow-[0_10px_30px_rgba(32,24,18,0.06)] backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-[var(--border-soft)] bg-[#ece4d8] px-2 py-1 text-xs font-semibold tracking-wide text-[var(--text-muted)]">
              Order Ops
            </span>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                        : "text-[var(--text-muted)] hover:bg-[#eee7dc]"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[var(--accent)] text-[var(--accent-contrast)]"
                        : "text-[var(--text-muted)] hover:bg-[#eee7dc]"
                    }`
                  }
                >
                  Orders
                </NavLink>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-semibold text-[var(--text-muted)] transition hover:bg-[#eee7dc]"
              >
                Login
              </Link>
            )}
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--text-muted)]">{username}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-[var(--border-soft)] bg-[#f4ecdf] px-3 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:bg-[#eadfcd]"
              >
                Logout
              </button>
            </div>
          ) : null}
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
