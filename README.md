# Developer Guide: VendorHub

Welcome to the **VendorHub** developer guide. This document outlines the setup, architecture, and coding standards for our Next.js frontend application.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js (v18 or higher)** installed on your machine.

### Installation

1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com
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
├── app/                  # Next.js App Router (pages, layouts, APIs)
├── components/           # Reusable UI components
│   ├── ui/               # Base design elements (buttons, inputs)
│   └── shared/           # Complex shared components
├── hooks/                # Custom React hooks
├── lib/                  # Third-party configurations (e.g., Axios/Query client)
├── public/               # Static assets (images, icons)
├── utils/                # Helper functions and formatting utilities
└── types/                # Global TypeScript definitions
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

## 🚀 Deployment & Building

To build the application for production, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run start
```
