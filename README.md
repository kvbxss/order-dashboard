# Order Management Dashboard

Frontend assignment implementation for a logistics order dashboard.

## Run

```bash
npm install
npm run dev
```

## Quality Gates

```bash
npm run check-types
npm run build
npm run test
```

## Architecture

- `src/domains/orders/model`: order state, selectors, validation, mock API.
- `src/domains/orders/ui`: order form and table views.
- `src/pages`: route-level composition (`Dashboard`, `Orders`, `Login`).
- `src/components`: cross-cutting UI infrastructure (`ProtectedRoute`, `AppErrorBoundary`).

State management uses Zustand with persisted slices:
- `order.store.ts` is the single source of truth for orders.
- `auth.store.ts` manages simple login session state.

## How This Addresses The Evaluation Criteria

### Data Integrity

- Dashboard metrics are derived from the same central `orders` state as CRUD operations.
- CRUD mutations (`createOrder/updateOrder/deleteOrder`) immediately update the store.
- Selectors (`getTotalOrders/getTotalPrice/getUniqueCountries`) are pure and deterministic.
- Automated store test verifies CRUD updates are reflected in computed metrics.

### Architecture

- Domain-first structure keeps business logic (`model`) separate from presentation (`ui/pages`).
- Validation/sanitization logic is centralized in `order.validation.ts`.
- Async behaviors are isolated in `order.api.ts` (mock latency + validation checks).

### Resilience

- Input validation and inline error messaging on create/edit flows.
- Store-level mutation errors are surfaced in UI with dismiss controls.
- Empty-state handling in dashboard and orders list.
- Global `AppErrorBoundary` provides controlled fallback for unexpected runtime failures.
- Recovery action: `Reset orders` button to restore a known-good empty state.

### Professional Standards

- Strict TypeScript settings.
- Lint + typecheck + build + tests scripts.
- Unit tests for selectors and validation.
- Store integrity tests for CRUD-to-dashboard synchronization.

## Test Coverage Snapshot

- `order.selectors.test.ts`: metric correctness.
- `order.validation.test.ts`: normalization and invalid payload rejection.
- `order.store.test.ts`: CRUD operations and immediate metric consistency.
