# Pokédex Web Application – Software Specification

## 1. Project Overview

This project is a web-based Pokédex application featuring the original **151 Pokémon from the Kanto region**. The application allows users to browse, search, filter, and locally track which Pokémon have been “caught”.

The system consists of:

* A **React-based frontend**
* A **Node.js / Express.js backend API**
* A **PostgreSQL database**
* A **monorepo architecture** consolidating frontend and backend

The architecture is designed to be extensible, allowing additional Pokémon regions to be added in the future.

---

## 2. Goals & Non-Goals

### Goals

* Migrate the frontend from **Create React App (CRA)** to **Vite**
* Upgrade **React**, **Node.js**, and **npm** to their latest stable versions
* Improve performance, developer experience, and maintainability
* Keep the project approachable for a small passion project
* Support accessibility and responsive behavior
* Enable easy future expansion

### Non-Goals (Current Scope)

* User authentication or accounts
* Server-side persistence of “caught” Pokémon
* Real-time data updates
* Frequent database writes

---

## 3. Technology Stack

### Frontend

* **React (latest stable)**
* **Vite** (build tool and dev server)
* **TypeScript**
* **Tailwind CSS**

  * Highly popular and approachable in 2026
  * Excellent responsive and accessibility utilities
  * Low abstraction and minimal lock-in
* Native Fetch API or Axios

### Backend

* **Node.js (latest LTS)**
* **npm (latest stable)**
* **Express.js**
* **TypeScript**
* **PostgreSQL**

### Testing

* **Playwright** (end-to-end testing – required)
* **Vitest or Jest** (unit/integration testing)

---

## 4. Repository & Architecture

### Monorepo Structure

A monorepo is preferred for:

* Shared types between frontend and backend
* Unified scripts and tooling
* Easier onboarding
* Reduced duplication

Example structure:

```text
react-dex/
├── apps/
│   ├── web/          # Vite + React frontend
│   └── api/          # Express backend
├── packages/
│   ├── shared/       # Shared types and utilities
├── scripts/
│   ├── seed-db.ts    # CSV import script
├── package.json
├── tsconfig.base.json
```

Workspace tooling options:

* npm workspaces (sufficient)
* pnpm or Turborepo (optional optimization)

---

## 5. Frontend Specification

### Pokémon Table

Displayed in a table format with the following columns:

| Column  | Description                                                    |
| ------- | -------------------------------------------------------------- |
| Dex #   | Pokédex number                                                 |
| Sprite  | Image from `https://img.pokemondb.net/sprites/home/{name}.png` |
| Name    | Pokémon name                                                   |
| Type(s) | Combined string (e.g. `Grass / Poison`)                        |
| Caught  | Checkbox                                                       |

---

### Lazy Loading & Infinite Scroll (Required)

To prevent all Pokémon data from loading at once, the table must implement **lazy loading using infinite scroll**.

**Behavior**

* Pokémon data is fetched in pages (e.g. 20–30 rows per request).
* Initial load retrieves the first page only.
* Additional data loads when the user scrolls to the bottom of the table or viewport.
* Loading continues until all available Pokémon are retrieved.

**Implementation Guidelines**

* Use `IntersectionObserver` or equivalent scroll detection.
* Display a loading indicator when fetching more rows.
* Prevent overlapping or duplicate fetches.
* Maintain smooth scrolling performance.

**Search & Filter Interaction**

* Changing search input or filters:

  * Clears existing data
  * Resets pagination state
  * Reloads results starting from page one

**Accessibility**

* Loading indicators must be screen-reader accessible
* Keyboard navigation must remain functional
* Focus should not jump unexpectedly during loads

---

### Search

* Search bar above the table
* Filters results **as the user types**
* Case-insensitive
* Matches Pokémon name and Dex number
* Resets pagination and lazy-load state

---

### Filtering

* Sidebar filter by Pokémon type
* Multiple types selectable
* Sidebar can be toggled (show/hide)
* Filter changes reset pagination state

---

### Caught State

* Stored in **localStorage**
* Persisted across browser refreshes
* Keyed by Dex number
* Independent of pagination, search, and filtering
* Never sent to the backend

---

### Accessibility (Required)

* Semantic HTML table markup
* Labels for all inputs and checkboxes
* Keyboard-accessible filters
* Adequate color contrast
* Appropriate ARIA attributes where needed

---

### Footer

A persistent footer must display:

> “This application is not affiliated with The Pokémon Company, Nintendo, or Game Freak.”

---

## 6. Backend API Specification

### API Style

* RESTful JSON API
* Read-heavy workload
* Stateless endpoints

### Example Endpoints

```http
GET /api/regions
GET /api/dex?region=kanto&limit=25&offset=0
GET /api/dex/:dexNum
```

### Caching Strategy

* Pokémon data is mostly static
* Use in-memory caching where appropriate
* Optional HTTP cache headers for clients

---

## 7. Database Design

### PostgreSQL

#### Table: `regions`

| Field | Type   | Notes              |
| ----- | ------ | ------------------ |
| id    | SERIAL | Primary key        |
| name  | TEXT   | Unique region name |

---

#### Table: `dex`

| Field    | Type    | Notes                      |
| -------- | ------- | -------------------------- |
| DexNum   | INTEGER | Pokédex number             |
| Name     | TEXT    | Pokémon name               |
| Type1    | TEXT    | Primary type               |
| Type2    | TEXT    | Nullable                   |
| RegionID | INTEGER | Foreign key → `regions.id` |

**Relationships**

* `dex.RegionID` references `regions.id`
* Enables future region expansion

---

## 8. Data Seeding

### CSV Import

* Initial Pokémon data provided via CSV
* A script (`scripts/seed-db.ts`) will:

  * Parse the CSV
  * Insert regions if missing
  * Insert Pokémon records
* Script must be idempotent

---

## 9. Testing Strategy

### End-to-End Testing

**Playwright (Required)**

* Page load validation
* Infinite scroll behavior
* Search and filter interactions
* LocalStorage persistence for caught state

---

### Unit & Integration Testing: Vitest vs Jest

#### Vitest

**Pros**

* Native Vite integration
* Fast startup and watch mode
* First-class TypeScript and ESM support
* Minimal configuration

**Cons**

* Slightly smaller ecosystem than Jest

---

#### Jest

**Pros**

* Very mature ecosystem
* Widely known in React projects
* Extensive plugin support

**Cons**

* Slower in modern Vite setups
* More configuration for ESM/TypeScript

**Recommendation:**
➡ **Vitest** is preferred due to tighter Vite integration, but Jest remains acceptable.

---

## 10. Migration Plan (CRA → Vite)

1. Create a new Vite + React + TypeScript project
2. Migrate existing components and assets
3. Remove CRA-specific configuration
4. Update environment variable handling
5. Upgrade React to latest stable
6. Address deprecated APIs and patterns
7. Configure Vitest and Playwright
8. Validate production build output

---

## 11. REST vs GraphQL (Informational)

### REST

* Simple
* Predictable
* Well-suited for static, read-heavy data

### GraphQL

* Flexible queries
* Avoids over/under-fetching
* Adds complexity not required for current scope

**Conclusion:** REST is the preferred approach.

---

## 12. Non-Functional Requirements

* Fast initial load
* Works without authentication
* Clean separation of concerns
* Easy local development
* Compatible with free-tier hosting providers

---

## 13. Future Enhancements (Out of Scope)

* User accounts and authentication
* Server-side caught persistence
* Multi-region support UI
* Offline/PWA support
* GraphQL API
* Admin tools