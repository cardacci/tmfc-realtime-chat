# Project Structure

This documentation explains the architecture, file organization, and design patterns used in the project.

## General Architecture

This project is a **real-time chat web application**.

### Technology Stack

| Technology       | Version | Purpose                               |
| ---------------- | ------- | ------------------------------------- |
| **React Router** | 7.9.2   | Routing framework                     |
| **React**        | 19.1.1  | UI library with functional components |
| **Tailwind CSS** | 4.1.13  | CSS utility framework                 |
| **TypeScript**   | 5.9.2   | Static typing and better DX           |
| **Vite**         | 7.1.7   | Ultra-fast build tool and dev server  |

## Directory Structure

```
web-technical-test/
│
├── app/                          # Application source code
│   ├── components/               # Reusable React components
│   │   └── chat/                 # Chat specific components
│   │       ├── Chat.tsx          # Main chat container
│   │       └── child-components/ # Reusable UI components for the chat (alerts, inputs, views, etc.)
│   │
│   ├── routes/                   # Route definitions
│   │   └── home.tsx              # Main route (/)
│   │
│   ├── app.css                  # Global application styles
│   ├── root.tsx                 # Root component (main layout)
│   └── routes.ts                # App route configuration
│
├── docs/                        # Documentation folder
│   ├── DEVELOPMENT_LOG.md       # Development progress log
│   ├── INDEX.md                 # Documentation index
│   ├── PROJECT_STRUCTURE.md     # Architecture documentation (this file)
│   ├── SETUP.md                 # Installation guide
│   └── product-strategy-and-design/ # Strategic analysis and design documents
│
├── public/                       # Static files (served as-is)
│   └── favicon.ico               # Application icon
│
├── node_modules/                 # Installed dependencies (generated)
│
├── .gitignore                   # Files ignored by Git
├── .dockerignore                # Files ignored by Docker
│
├── Dockerfile                   # Docker configuration
├── package.json                 # Dependencies and npm scripts
├── package-lock.json            # Exact dependency versions
│
├── react-router.config.ts       # React Router configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
│
└── README.md                    # Technical test documentation
```

## Key File Descriptions

### Configuration Files

#### `package.json`

Defines project dependencies and execution scripts.

**Main dependencies:**

- `@react-router/node` and `@react-router/serve`: SSR
- `isbot`: Bot detection for SSR optimization
- `react-router`: Routing framework
- `react` and `react-dom`: UI library

**DevDependencies:**

- `@react-router/dev`: Development tools
- `@tailwindcss/vite`: Tailwind plugin for Vite
- `typescript`: TypeScript compiler
- `vite`: Build tool and dev server

**Scripts:**

```json
{
	"build": "react-router build", // Production build
	"dev": "react-router dev", // Development server
	"start": "react-router-serve ...", // Production server
	"typecheck": "react-router typegen && tsc" // Type checking
}
```

#### `vite.config.ts`

Vite configuration with plugins:

```typescript
export default defineConfig({
	plugins: [
		tailwindcss(), // Tailwind CSS processing
		reactRouter(), // React Router integration
		tsconfigPaths(), // TS path aliases support
	],
});
```

#### `react-router.config.ts`

React Router configuration:

```typescript
export default {
	ssr: true, // Server-Side Rendering enabled
} satisfies Config;
```

#### `tsconfig.json`

TypeScript configuration with strict options and ES2022 modules.

### Application Files

#### `app/root.tsx`

**Purpose:** Root component that wraps the entire application.

**Responsibilities:**

- Defines base HTML (`<html>`, `<head>`, `<body>`)
- Includes metadata and global styles
- Renders the `<Outlet />` where routes are mounted

#### `app/routes.ts`

**Purpose:** Defines the application's route configuration.

#### `app/routes/home.tsx`

**Purpose:** Main route component (`/`).

**Responsibilities:**

- Defines SEO metadata (`meta` function)
- Renders the `Chat` component

#### `app/components/chat/Chat.tsx`

**Purpose:** Main chat container component.

**Responsibilities:**

- Manages the chat stream connection (SSE)
- Handles message state and history
- Renders the conversation view and input area

#### `app/app.css`

**Purpose:** Global styles and Tailwind configuration.

---

**Last updated:** 2025-11-24
