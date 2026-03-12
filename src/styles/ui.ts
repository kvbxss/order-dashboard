export const ui = {
  pageTitle: "text-4xl font-bold tracking-tight",
  mutedText: "text-(--text-muted)",
  leadText: "mt-1 text-sm text-(--text-muted)",
  panel: "rounded-2xl border border-(--border-soft) bg-(--bg-panel)",
  panelShadow: "shadow-[0_10px_24px_rgba(24,18,12,0.06)]",
  panelPadding: "p-5",
  formInput:
    "rounded-xl border border-(--border-soft) bg-white px-3 py-2 outline-none transition focus:border-(--accent)",
  buttonPrimary:
    "rounded-xl bg-(--accent) px-4 py-2 font-semibold text-(--accent-contrast) transition hover:brightness-95",
  buttonDisabled: "disabled:cursor-not-allowed disabled:opacity-55",
  tableInput:
    "h-9 w-full rounded-lg border border-(--border-soft) bg-white px-2 py-1 outline-none transition focus:border-(--accent)",
  rowValue: "inline-flex h-9 items-center",
  actionButtonBase:
    "h-8 rounded-lg px-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45",
  navShell:
    "mb-8 flex items-center justify-between gap-3 rounded-2xl border border-(--border-soft) bg-(--bg-panel)/95 p-3 shadow-[0_10px_30px_rgba(32,24,18,0.06)] backdrop-blur",
  navPill:
    "rounded-md border border-(--border-soft) bg-[#ece4d8] px-2 py-1 text-xs font-semibold tracking-wide text-(--text-muted)",
  navLinkBase: "rounded-md px-3 py-2 text-sm font-semibold transition",
  navLinkActive: "bg-(--accent) text-(--accent-contrast)",
  navLinkIdle: "text-(--text-muted) hover:bg-[#eee7dc]",
};
