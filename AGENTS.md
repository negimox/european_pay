<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# College Event Portal — Agent Rules

This project is a 12-Hour Challenge to build a **College Event Management Portal** using **Next.js (App Router)** and a **database (relational or non-relational)**.

All agents (Gemini, Claude, etc.) working on this repository must strictly adhere to the following rules, architecture guidelines, and assignment goals.

---

## 1. UI Component Library (shadcn/ui)
- **Primary Library:** You **MUST** use **shadcn/ui** for UI components.
- **Documentation:** Always consult the official shadcn component documentation at https://ui.shadcn.com/docs/components/ to ensure correct usage and properties.
- **Aesthetics & Styling:**
  - Build highly responsive, premium-feeling layouts (dark mode capability, smooth transitions, modern gradients, Outfit/Inter typography).
  - Use loading skeletons and skeleton screens (using shadcn's skeleton component) during data fetching to enhance perceived performance.

## 2. Database Design & Entities
- **Database Engine:** PostgreSQL database hosted on **Supabase**.
- **ORM:** **Prisma ORM** for type-safe database queries and migrations.
- **Skills Usage:** Always consult the workspace-level `supabase` and `supabase-postgres-best-practices` skills to ensure secure Row-Level Security (RLS) policies, efficient schema design, and optimal query performance.
- **Entity Schemas:** Ensure the relational schema implements and maintains the following entities:
  - **Users:** Authentication, profiles, and roles (Student, Admin).
  - **Events:** Banner/image URL, title, description, category, venue, date/time, registration deadline, capacity (seats available), and registrant tracking.
  - **Registrations:** Association between students and registered events, with support for registration cancellation.
  - **Announcements:** System announcements published by admins to show on student dashboards.


## 3. Core Requirements Checklists
### Authentication
- [ ] Secure Registration (Sign up)
- [ ] Secure Student/Admin Login (Sign in)
- [ ] Session persistence & Logout (Sign out)
- [ ] Route guards (Protected routes) for admin pages and student-specific dashboards

### Student Features
- [ ] Responsive student dashboard
- [ ] View upcoming events
- [ ] Register for events (with seat constraint check)
- [ ] View registered events & Cancel registration
- [ ] View admin announcements

### Event Listings
- [ ] Clean event cards displaying banner/image, name, description, date/time, venue, category, registration deadline, seats available, and a quick register button.

### Admin Panel
- [ ] CRUD operations for events (Create, Read, Update, Delete)
- [ ] View list of registrations per event
- [ ] Create and publish announcements

## 4. Evaluation Criteria Priorities
When writing code, design systems, or database migrations, prioritize the following weightings:
- **UI/UX Design (20%):** Clean layouts, premium tailwind/shadcn styling, visual feedback, animations.
- **Backend Architecture (20%):** Type-safe API endpoints, clean Next.js server actions or route handlers, secure checks.
- **Database Design (15%):** Well-structured queries, index efficiency, proper relationships/foreign keys.
- **Code Quality (15%):** TypeScript strict typing, separation of concerns, readable structure, proper error handling.
- **Feature Completion (20%):** Meeting all core requirements before working on bonus features.
- **Innovation & Bonus Features (10%):** Search & filters, QR codes, dark mode, user profiles, dashboard analytics, email notifications.

