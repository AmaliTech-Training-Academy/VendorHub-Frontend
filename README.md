# Developer Guide: VendorHub

Welcome to the **VendorHub** developer guide. This document outlines the setup, architecture, and coding standards for our Next.js frontend application.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js (v18 or higher)** installed on your machine.

### Installation

1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/AmaliTech-Training-Academy/VendorHub-Frontend.git
   cd VendorHub-Frontend
   ```
2. Install the project dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Copy the template environment file and fill in the required keys:

```bash
cp .env.example .env.local
```

### Connecting to the Backend

This frontend expects a running instance of the **[VendorHub Backend](https://github.com/AmaliTech-Training-Academy/VendorHub-Backend)** (Django). Set up and run it separately using that repo's own setup instructions.

Once it's running locally, point this app at it via `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Adjust the port if your local backend runs elsewhere.

### Local Development

Start the development server:

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 📦 Tech Stack & Libraries

We use the following core technologies and libraries for state management, forms, and data fetching:

- **Next.js (App Router)** - The core React framework.
- **TypeScript** - For type-safe JavaScript.
- **Zustand** - Light and fast global state management.
- **React Hook Form** - Performance-focused form validation with minimal re-renders.
- **Zod** - TypeScript-first schema validation for forms and API data.
- **@hookform/resolvers** - Bridges **React Hook Form** with **Zod** validation.
- **@tanstack/react-query** - Handles asynchronous data fetching, caching, and server-state management.

---

## 📂 Project Structure

```text
├── app/                     # Next.js App Router (pages, layouts, routes)
│   ├── (auth)/              # Login/register route group
│   ├── dashboard/           # Vendor-facing routes
│   ├── onboarding/          # Onboarding flow routes
│   ├── storefront/          # Employee-facing routes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── not-found.tsx        # 404 page
│   └── page.tsx             # Root page
├── components/              # Reusable UI components
│   ├── ui/                  # Base design elements (buttons, inputs)
│   └── shared/               # Complex shared components
├── hooks/                   # Custom React hooks
├── lib/                     # Third-party configurations, API layer (e.g., lib/api/auth.ts)
├── public/                  # Static assets (images, icons)
├── schemas/                 # Zod validation schemas (loginSchema.ts, registerSchema.ts)
├── store/                   # Zustand stores (useAuthStore.ts)
├── types/                   # Global TypeScript definitions
├── utils/                   # Helper functions and formatting utilities
├── middleware.ts            # Next.js middleware (route protection, etc.)
├── .env.example             # Environment variable template
└── next.config.ts           # Next.js configuration
```

---

## 🛠️ Coding Standards

### Component Architecture

- **Server Components by Default:** Keep components as Server Components to optimize performance and SEO.
- **Client Components:** Use the `'use client'` directive at the very top of the file _only_ when using browser APIs, state (`useState`), or lifecycle effects (`useEffect`).

### Naming Conventions

- **Components:** Use `PascalCase` for folders, files, and component names (e.g., `VendorProfile.tsx`).
- **Functions & Variables:** Use `camelCase` (e.g., `fetchUserData`).

### Commit Messages

We follow conventional commit formatting:

- `feat:` A new feature.
- `fix:` A bug fix.
- `docs:` Documentation changes.
- `refactor:` Code changes that neither fix a bug nor add a feature.

---

## 🔐 Authentication Architecture

Auth follows a clear split of responsibilities:

- **TanStack Query (`useMutation`)** owns the async lifecycle of login/register calls — loading state, error state, retries.
- **Zustand (`useAuthStore`)** owns the _resulting_ session state — the current `role` and `accessToken` — so it's readable from anywhere in the app without prop drilling.
- **`lib/api/auth.ts`** is the only place that knows about the backend's actual HTTP shape (endpoints, request/response bodies). Hooks never call `fetch` directly.

### Flow

1. A form (`useUserLogin` / `useUserRegistration`) validates input via `react-hook-form` + `zod`.
2. On submit, a `useMutation`'s `mutationFn` calls the relevant function in `lib/api/auth.ts` (`loginUser`, `registerVendor`, `registerEmployee`).
3. Registration has no dedicated "log the user in" response from the backend — `mutationFn` chains a `loginUser` call immediately after a successful register, so registering always ends in an authenticated session.
4. On success, `useAuthStore.getState().setAuth(role, accessToken, refreshToken)` persists the session to `localStorage` and updates in-memory state.
5. The consuming page (`AuthPage`) reads `role` from the mutation's `onSuccess` callback to redirect to the correct dashboard (`/dashboard/products` for vendors, `/storefront` for employees).

## 🚀 Deployment & Building

To build the application for production, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run start
```
