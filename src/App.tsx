import { Routes, Route, Navigate, Link, NavLink } from "react-router";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuthStore } from "./store/auth.store";
import { ui } from "./styles/ui";
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
        <nav className={ui.navShell}>
          <div className="flex items-center gap-3">
            <span className={ui.navPill}>
              Order Management Dashboard
            </span>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${ui.navLinkBase} ${
                      isActive
                        ? ui.navLinkActive
                        : ui.navLinkIdle
                    }`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/orders"
                  className={({ isActive }) =>
                    `${ui.navLinkBase} ${
                      isActive
                        ? ui.navLinkActive
                        : ui.navLinkIdle
                    }`
                  }
                >
                  Orders
                </NavLink>
              </>
            ) : (
              <Link
                to="/login"
                className={`${ui.navLinkBase} ${ui.navLinkIdle}`}
              >
                Login
              </Link>
            )}
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className={`text-sm ${ui.mutedText}`}>{username}</span>
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
