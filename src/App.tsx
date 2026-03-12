import { Routes, Route, Navigate, Link } from "react-router";
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <nav className="mb-8 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Orders
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </Link>
            )}
          </div>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">{username}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
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
