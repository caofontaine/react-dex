# Pokédex Application – Implementation TODO List

---

## Phase 1: Project & Infrastructure Setup (Critical)

### ✅ 1.1 Initialize Monorepo Structure

**Description:**
Set up a monorepo to host frontend, backend, shared packages, and scripts.

**Acceptance Criteria**

* Monorepo uses npm workspaces (or equivalent)
* `apps/web`, `apps/api`, `packages/shared`, and `scripts/` directories exist
* Root `package.json` manages workspaces correctly
* Shared TypeScript config is defined (`tsconfig.base.json`)

---

### ✅ 1.2 Upgrade Node.js and npm

**Description:**
Ensure the project uses the latest stable Node.js and npm versions.

**Acceptance Criteria**

* Node.js version documented (e.g. via `.nvmrc`)
* npm version updated and documented
* Project installs and runs without version warnings

---

### ✅ 1.3 Migrate Frontend from CRA to Vite

**Description:**
Replace Create React App with a Vite-based React + TypeScript setup.

**Acceptance Criteria**

* CRA removed entirely
* Vite dev server runs successfully
* Production build succeeds
* Environment variables work as expected
* App renders without runtime errors

---

### ✅ 1.4 Upgrade React to Latest Stable Version

**Description:**
Upgrade React and React DOM, refactoring code as needed.

**Acceptance Criteria**

* React and React DOM are latest stable versions
* No deprecated lifecycle warnings
* Application behavior matches pre-upgrade behavior

---

### ✅ 1.5 Backend Project Setup (Express + TypeScript)

**Description:**
Set up Express API with TypeScript support.

**Acceptance Criteria**

* Express server starts successfully
* API responds to a health-check endpoint
* TypeScript compilation succeeds
* Shared types can be imported from `packages/shared`

---

### ✅ 1.6 PostgreSQL Connection Setup

**Description:**
Configure backend to connect to PostgreSQL.

**Acceptance Criteria**

* Database connection works locally
* Connection configuration uses environment variables
* Errors are handled gracefully

---

## Phase 2: Database & Data Layer

### ✅ 2.1 Create Database Schema

**Description:**
Implement PostgreSQL schema for `regions` and `dex` tables.

**Acceptance Criteria**

* Tables exist with correct fields and types
* Foreign key relationship is enforced
* Schema matches specification exactly

---

### ✅ 2.2 Implement CSV Data Seed Script

**Description:**
Create a script to seed Pokémon data from CSV into the database.

**Acceptance Criteria**

* Script parses CSV correctly
* Regions are inserted once
* Pokémon records are inserted correctly
* Script is idempotent (safe to re-run)

---

### ✅ 2.3 Implement Backend Caching Strategy

**Description:**
Cache read-heavy Pokémon data for performance.

**Acceptance Criteria**

* API avoids unnecessary database queries
* Cache invalidation strategy is documented
* Behavior is transparent to clients

---

## Phase 3: Backend API Features

### ✅ 3.1 Implement Regions API Endpoint

**Description:**
Expose regions via REST endpoint.

**Acceptance Criteria**

* `GET /api/regions` returns region list
* Response is JSON
* Endpoint handles empty data gracefully

---

### ✅ 3.2 Implement Dex API with Pagination

**Description:**
Expose Pokémon data with pagination support.

**Acceptance Criteria**

* `GET /api/dex` supports `limit` and `offset`
* Data is filtered by region
* Pagination is consistent and deterministic

---

### ✅ 3.3 Implement Single Pokémon Endpoint

**Description:**
Fetch Pokémon by Dex number.

**Acceptance Criteria**

* `GET /api/dex/:dexNum` works correctly
* Returns 404 for invalid Dex numbers
* Response matches frontend expectations

---

## Phase 4: Frontend Core Features

### ✅ 4.1 Configure Tailwind CSS

**Description:**
Install and configure Tailwind CSS for styling.

**Acceptance Criteria**

* Tailwind classes work in components
* Build output includes Tailwind styles
* No unused CSS warnings

---

### ✅ 4.2 Implement Pokémon Table UI

**Description:**
Render Pokémon data in a table layout.

**Acceptance Criteria**

* Table displays Dex #, Sprite, Name, Type(s), Caught
* Sprite images load correctly from PokèmonDB URLs
* Table uses semantic HTML

---

### ✅ 4.3 Implement Lazy Loading / Infinite Scroll

**Description:**
Load Pokémon data incrementally as the user scrolls.

**Acceptance Criteria**

* Initial load fetches only first page
* Additional data loads when scrolling to bottom
* No duplicate fetches occur
* Loading indicator is visible and accessible

---

### ✅ 4.4 Implement Search Functionality

**Description:**
Filter Pokémon results as the user types.

**Acceptance Criteria**

* Search is case-insensitive
* Matches name and Dex number
* Search resets pagination state
* Results update in real time

---

### ✅ 4.5 Implement Type Filtering Sidebar

**Description:**
Allow filtering Pokémon by type.

**Acceptance Criteria**

* Sidebar can be toggled
* Multiple types can be selected
* Filter resets lazy-load state
* UI reflects active filters

---

### ✅ 4.6 Implement “Caught” State with Local Storage

**Description:**
Persist caught Pokémon locally.

**Acceptance Criteria**

* Checkbox toggles correctly
* State persists after page refresh
* State is independent of pagination and filtering
* No backend calls are made

---

### ✅ 4.7 Add Accessibility Enhancements

**Description:**
Ensure application meets basic accessibility requirements.

**Acceptance Criteria**

* All inputs have labels
* Keyboard navigation works
* ARIA attributes used where necessary
* Color contrast meets accessibility standards

---

### ✅ 4.8 Add Footer Disclaimer

**Description:**
Include legal disclaimer in the UI footer.

**Acceptance Criteria**

* Footer is visible on all pages
* Disclaimer text matches specification exactly

---

## Phase 5: Testing & Quality Assurance (Final Phase)

### ✅ 5.1 Configure Playwright

**Description:**
Set up Playwright for end-to-end testing.

**Acceptance Criteria**

* Playwright runs successfully
* Tests can be executed locally
* CI-compatible configuration exists

---

### ✅ 5.2 Write Playwright E2E Tests

**Description:**
Cover critical user flows.

**Acceptance Criteria**

* Tests cover:

  * Page load
  * Infinite scroll
  * Search
  * Filtering
  * Caught state persistence
* Tests are deterministic and stable

---

### ✅ 5.3 Configure Unit/Integration Testing (Vitest or Jest)

**Description:**
Set up chosen test framework.

**Acceptance Criteria**

* Tests run successfully
* TypeScript support works
* Coverage reporting available

---

### ✅ 5.4 Write Unit & Integration Tests

**Description:**
Test core frontend and backend logic.

**Acceptance Criteria**

* Key components and API handlers tested
* Tests are readable and maintainable
* No failing tests in CI

---

## Phase 6: Final Validation

### ✅ 6.1 Production Build & Smoke Testing

**Description:**
Validate full application behavior.

**Acceptance Criteria**

* Frontend builds successfully
* Backend runs without errors
* App works end-to-end in production mode
