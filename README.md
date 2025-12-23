# Events Management 

A full-stack Events Management module built with Next.js, a CRUD backend system for managing Events.

The application allows users to create, view, edit, and delete events.

---

## 🚀 Live Demo

🔗 Live URL: https://eventManagement3.netlify.app/

---

## 🛠 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)

### Backend
- Next.js API Routes
- TypeScript
- Drizzle ORM
- PostgreSQL (Neon)

### Tooling & Deployment
- Netlify (Next.js Runtime)
- GitHub
- Zod (input validation)

---

## ✨ Features

- Create, update, delete events
- View all events and individual event details
- Fully typed APIs and responses
- Server-side input validation using Zod
- Client-side data fetching and mutations using React Query
- Clean, readable, and maintainable code structure
- Responsive UI with basic accessibility considerations

---
## ⚙️ Setup Instructions

Follow the steps below to run the project locally.

### 1. Clone the repository
```bash
git clone (https://github.com/raj-1106/event-management)
cd event-management
npm install
npx drizzle-kit push
npm run dev
```
## ✅ 2. Environment Variables

Add this section:

```md
## 🔐 Environment Variables

The following environment variables are required to run the project:

```env
DATABASE_URL=your_neon_postgresql_connection_string```

```
## 📝 Assumptions & Notes

- Authentication was intentionally omitted to keep the focus on core Events CRUD functionality.
- The UI focuses on clarity, responsiveness, and accessibility with subtle animations.


