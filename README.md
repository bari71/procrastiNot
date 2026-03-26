<div align="center">

# 🏗️ Procrasti-Not — Real-Time Project Management Platform

A production-grade, full-stack project management application inspired by Jira — built from scratch with **Next.js 14**, **TypeScript**, **Hono RPC**, and **Appwrite**. Features workspace collaboration, Kanban boards with drag-and-drop, calendar scheduling, analytics dashboards, role-based access control, and invite-based team onboarding.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://procrasti-not-pi.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)]()
[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)]()
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)]()

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)

---

## Overview

Procrasti-Not is a **multi-tenant project management system** where teams can create workspaces, organize projects, and track tasks through customizable workflows. The application demonstrates full-stack engineering depth: end-to-end type safety from database to UI, a custom API layer with RPC-style client generation, server-side rendering with granular client hydration, and production-ready patterns including role-based authorization, optimistic updates, and bulk operations.

**This is not a tutorial clone.** The codebase implements real-world patterns used in production SaaS applications — feature-based architecture, session middleware, positional ordering algorithms for drag-and-drop persistence, and server-side data aggregation for analytics.

---

## Key Features

### Workspace & Team Collaboration
- **Multi-workspace support** — users can create, switch between, and manage multiple workspaces
- **Invite system** — shareable invite codes for team onboarding with one-click join flow
- **Role-based access control** — `ADMIN` and `MEMBER` roles with granular permission checks on every API endpoint
- **Member management** — admins can promote, demote, or remove team members with safeguards against destructive actions (last-member protection, self-deletion rules)

### Task Management Engine
- **Full CRUD** with real-time cache invalidation via TanStack Query
- **Multi-view task switching** — seamlessly toggle between:
  - **Table View** — sortable, filterable data table powered by TanStack Table v8
  - **Kanban Board** — drag-and-drop columns with `@hello-pangea/dnd`, persisted via bulk position updates
  - **Calendar View** — month-based scheduling with `react-big-calendar` and custom event cards
- **Advanced filtering** — filter by status, assignee, project, due date, and keyword search with URL-persisted state via `nuqs`
- **Bulk operations** — batch status and position updates for Kanban reordering in a single API call

### Kanban Drag-and-Drop with Positional Ordering
- Custom **positional ordering algorithm** — new tasks receive positions in increments of 1,000, enabling efficient reordering without recalculating entire columns
- Cross-column drag updates both `status` and `position` atomically
- Optimistic UI updates with server reconciliation

### Analytics Dashboard
- **Workspace-level and project-level analytics** with month-over-month comparisons
- Metrics tracked: assigned tasks, completed tasks, overdue tasks, incomplete tasks
- Visual indicators for positive/negative trends vs. previous period

### Authentication & Security
- **Session-based auth** with HTTP-only, secure, SameSite-strict cookies (30-day expiry)
- **Dual Appwrite client architecture** — admin client for privileged operations (user creation, cross-user lookups), session client for user-scoped data access
- **Custom session middleware** — Hono middleware that hydrates every API request with authenticated database, storage, and account clients
- **Per-route and per-API authorization** — no global middleware; each endpoint explicitly validates membership and role

### Project Organization
- Create and manage multiple projects within a workspace
- Project-specific analytics and task filtering
- Image upload support via Appwrite Storage
- Project settings with edit/delete capabilities

### UI/UX Engineering
- **Responsive modal system** — `Dialog` on desktop, `Drawer` on mobile via a unified `ResponsiveModal` component
- **Confirmation dialogs as Promises** — custom `useConfirm` hook returns `[ConfirmDialog, confirm()]` where `confirm()` is a Promise that resolves on user action
- **Toast notifications** via Sonner for all mutations
- **Loading and error boundaries** — global `loading.tsx` and `error.tsx` with graceful fallback UI
- **Workspace switcher** in sidebar with real-time workspace list

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js 14 App Router             │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────┐ │
│  │  Server       │  │  Client    │  │  Standalone  │ │
│  │  Components   │  │  Components│  │  Pages       │ │
│  │  (Auth guard, │  │  (Hooks,   │  │  (Settings,  │ │
│  │   SSR data)   │  │   UI, DnD) │  │   Members)   │ │
│  └──────┬───────┘  └─────┬──────┘  └──────────────┘ │
│         │                │                           │
│         ▼                ▼                           │
│  ┌─────────────────────────────────┐                 │
│  │     TanStack Query v5           │                 │
│  │  (Cache, Mutations, Invalidation)│                │
│  └──────────────┬──────────────────┘                 │
│                 │                                    │
│                 ▼                                    │
│  ┌─────────────────────────────────┐                 │
│  │  Hono RPC Client (hc<AppType>) │                 │
│  │  End-to-end type inference      │                 │
│  └──────────────┬──────────────────┘                 │
│                 │                                    │
├─────────────────┼────────────────────────────────────┤
│                 ▼                                    │
│  ┌─────────────────────────────────┐                 │
│  │  Hono API Layer                 │                 │
│  │  Single catch-all route handler │                 │
│  │  ┌───────────────────────────┐  │                 │
│  │  │  Session Middleware       │  │                 │
│  │  │  (Cookie → Appwrite SDK) │  │                 │
│  │  └───────────────────────────┘  │                 │
│  │  ┌───────────────────────────┐  │                 │
│  │  │  Zod Request Validation   │  │                 │
│  │  └───────────────────────────┘  │                 │
│  │  ┌───────────────────────────┐  │                 │
│  │  │  Domain Route Handlers    │  │                 │
│  │  │  (auth, workspaces,       │  │                 │
│  │  │   projects, tasks,        │  │                 │
│  │  │   members)                │  │                 │
│  │  └───────────────────────────┘  │                 │
│  └──────────────┬──────────────────┘                 │
│                 │                                    │
├─────────────────┼────────────────────────────────────┤
│                 ▼                                    │
│  ┌─────────────────────────────────┐                 │
│  │  Appwrite (BaaS)                │                 │
│  │  • Databases  • Auth/Sessions   │                 │
│  │  • Storage    • Users API       │                 │
│  └─────────────────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

### Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Hono over Next.js API routes** | Type-safe RPC with `hc<AppType>` eliminates manual type definitions for API calls; composable middleware; runs on edge and Node |
| **Feature-based module structure** | Each domain (`auth`, `tasks`, `projects`, etc.) is self-contained with its own API hooks, components, server routes, schemas, and types — enables independent development and testing |
| **Server Components for auth gates** | Pages are async Server Components that check session and redirect; heavy UI is deferred to Client Components with hooks — optimal code splitting |
| **URL-persisted filter state (nuqs)** | Task filters and view state are stored in URL search params — shareable, bookmarkable, survives refresh |
| **Positional ordering for Kanban** | Increment-based positioning (steps of 1,000) allows O(1) insertion and reordering without recalculating sibling positions |
| **TanStack Query for server state** | Declarative cache management with 60s stale time, automatic background refetch, and mutation-driven invalidation |

---

## Tech Stack

### Core
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** | React framework with App Router, Server Components, SSR |
| **TypeScript** | End-to-end type safety |
| **Hono** | Lightweight, type-safe API framework with RPC client generation |
| **Appwrite** | Backend-as-a-Service (database, auth, storage, users) |

### Frontend
| Technology | Purpose |
|-----------|---------|
| **TanStack Query v5** | Async state management, caching, mutations |
| **TanStack Table v8** | Headless, sortable/filterable data tables |
| **Radix UI** | Accessible, unstyled UI primitives (dialog, dropdown, select, tabs, etc.) |
| **Tailwind CSS** | Utility-first styling |
| **@hello-pangea/dnd** | Drag-and-drop for Kanban board |
| **react-big-calendar** | Calendar view with month navigation |
| **react-hook-form + Zod** | Performant forms with schema-based validation |
| **nuqs** | Type-safe URL search param state management |
| **Sonner** | Toast notification system |
| **date-fns** | Date manipulation and formatting |
| **Recharts** | Charting library for data visualization |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- An [Appwrite](https://appwrite.io/) instance (cloud or self-hosted)

### Installation

```bash
git clone https://github.com/bari71/procrastiNot.git
cd procrasti-not
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id

NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id
NEXT_PUBLIC_APPWRITE_WORKSPACES_ID=your_workspaces_collection_id
NEXT_PUBLIC_APPWRITE_MEMBERS_ID=your_members_collection_id
NEXT_PUBLIC_APPWRITE_PROJECTS_ID=your_projects_collection_id
NEXT_PUBLIC_APPWRITE_TASKS_ID=your_tasks_collection_id
NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID=your_storage_bucket_id

NEXT_APPWRITE_KEY=your_api_key
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/[[...route]]/         # Hono catch-all API handler
│   ├── (auth)/                   # Auth layout group (sign-in, sign-up)
│   ├── (dashboard)/              # Main app layout (sidebar, navbar, modals)
│   │   └── workspaces/[id]/      # Workspace pages, task views, project views
│   └── (standalone)/             # Standalone pages (settings, members, join)
│
├── features/                     # Feature-based domain modules
│   ├── auth/                     # Authentication (login, register, session)
│   │   ├── api/                  # React Query hooks (useLogin, useRegister, etc.)
│   │   ├── components/           # SignInCard, SignUpCard, UserButton
│   │   ├── server/               # Hono route handlers
│   │   ├── schemas.ts            # Zod validation schemas
│   │   └── queries.ts            # Server Actions (getCurrent)
│   ├── workspaces/               # Workspace management + analytics
│   ├── projects/                 # Project CRUD + analytics
│   ├── tasks/                    # Task engine (CRUD, Kanban, Calendar, Table)
│   └── members/                  # Team member management + RBAC
│
├── components/                   # Shared UI components
│   ├── ui/                       # Radix-based primitives (button, dialog, etc.)
│   ├── analytics.tsx             # Analytics dashboard cards
│   └── responsive-modal.tsx      # Dialog/Drawer responsive switcher
│
├── hooks/                        # Shared hooks
│   └── use-confirm.tsx           # Promise-based confirmation dialog
│
└── lib/                          # Core utilities
    ├── appwrite.ts               # Admin + Session Appwrite client factories
    ├── rpc.ts                    # Hono RPC client (hc<AppType>)
    ├── session-middleware.ts      # Hono middleware for auth + context injection
    └── utils.ts                  # Shared utilities
```

---

## API Reference

The API is a **Hono application** mounted at `/api` with five domain routers:

### Authentication — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login` | Authenticate with email/password, set session cookie |
| `POST` | `/register` | Create account, auto-login, set session cookie |
| `POST` | `/logout` | Clear session cookie, revoke Appwrite session |
| `GET` | `/current` | Get authenticated user profile |

### Workspaces — `/api/workspaces`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List user's workspaces |
| `POST` | `/` | Create workspace (multipart, image upload) |
| `GET` | `/:id` | Get workspace details |
| `PATCH` | `/:id` | Update workspace (admin only) |
| `DELETE` | `/:id` | Delete workspace (admin only) |
| `POST` | `/:id/join` | Join via invite code |
| `POST` | `/:id/reset-invite-code` | Regenerate invite code (admin only) |
| `GET` | `/:id/analytics` | Workspace-level analytics |

### Projects — `/api/projects`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List projects in workspace |
| `POST` | `/` | Create project (multipart, image upload) |
| `GET` | `/:id` | Get project details |
| `PATCH` | `/:id` | Update project |
| `DELETE` | `/:id` | Delete project |
| `GET` | `/:id/analytics` | Project-level analytics |

### Tasks — `/api/tasks`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List tasks (filterable by status, assignee, project, date, search) |
| `POST` | `/` | Create task with positional ordering |
| `GET` | `/:id` | Get task with populated project + assignee |
| `PATCH` | `/:id` | Update task fields |
| `DELETE` | `/:id` | Delete task |
| `POST` | `/bulk-update` | Batch update status + position (Kanban drag) |

### Members — `/api/members`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List workspace members with user details |
| `PATCH` | `/:id` | Update member role (admin only) |
| `DELETE` | `/:id` | Remove member (with safeguards) |

---

## Roadmap

- [ ] Automated test suite (unit + integration + E2E)
- [ ] Real-time updates via WebSocket/SSE
- [ ] Activity log and audit trail
- [ ] Notification system (in-app + email)
- [ ] File attachments on tasks
- [ ] Dark mode theme toggle
- [ ] Advanced Recharts analytics dashboard
- [ ] GitHub/Google OAuth integration

---

<div align="center">

**Built with precision by [Annur Bari](https://github.com/bari71)**

</div>
