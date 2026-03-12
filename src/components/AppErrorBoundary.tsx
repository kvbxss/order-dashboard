import type { ReactNode } from "react";
import { Component } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Uncaught application error:", error);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto mt-8 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-sm">{this.state.error?.message}</p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
          >
            Reload app
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
