# 🧠 RAG Stack – Full-Stack AI Chat with Supabase, Workers, and File Uploads

This project is a full-stack RAG (Retrieval-Augmented Generation) application using:

* ⚙️ **Next.js 15** (with SSR + API routes)
* 🔐 **Supabase** (Auth, DB, Vector Embeddings)
* 🤖 **BullMQ Workers** for chunking & embedding PDFs
* 🔌 **Socket.IO** for upload status & real-time updates
* ☁️ **TUS** protocol for resumable file uploads
* 📦 **Docker** for running it all together

---

## 📦 Prerequisites

Install the following:

* [Docker](https://www.docker.com/products/docker-desktop)
* [Node.js 20+](https://nodejs.org/en/)
* [Supabase CLI](https://supabase.com/docs/guides/cli)

---

## 🛠️ 1. Setup Supabase Locally

```bash
npm install -g supabase
git clone https://github.com/yourusername/rag-stack.git
cd rag-stack
supabase start
supabase db reset
```

---

## ⚙️ 2. Environment Setup

Create a `.env.local` file:

```env
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU


NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=

SUPABASE_AUTH_EXTERNAL_GITHUB_CLIENT_ID=
SUPABASE_AUTH_EXTERNAL_GITHUB_SECRET=
SUPABASE_AUTH_EXTERNAL_GITHUB_SITE_REDIRECT_URI=http://localhost:3000/api/auth/callback/github
NEXT_PUBLIC_SUPABASE_BUCKET_NAME=documents

GOTRUE_EXTERNAL_GITHUB_ENABLED=true
GOTRUE_EXTERNAL_GITHUB_CLIENT_ID=
GOTRUE_EXTERNAL_GITHUB_SECRET=
GOTRUE_EXTERNAL_GITHUB_REDIRECT_URI=http://localhost:54321/auth/v1/callback
GOTRUE_SITE_URL=http://localhost:3000

REDIS_URL=redis://redis:6379

OPENAI_API_KEY=

REDIS_HOST=redis
```

✅ Visit [http://localhost:54323](http://localhost:54323) to get your keys.

---

## 🐳 3. ⚠️ Docker Notice

> ⚠️ **Important:**
> The package `@supabase/ssr` is **not compatible with Next.js Edge Middleware**, which prevents the Dockerfile from building successfully at this time.

Until this is resolved:

* ✅ You **can still use Docker** to run Redis
* ✅ You **must run the app manually via `npm`**

---

### 👉 Recommended Dev Workflow

Start Redis with Docker:

```bash
docker compose up redis
```

Then, in a separate terminal, start the app and services manually:

```bash
npm run dev           # Start Next.js (port 3000)
npm run start:worker  # Start the embedding worker
npm run start:socket  # Start the WebSocket server
```

You can also combine them in a single command (optional):

```bash
npm run dev & npm run start:worker & npm run start:socket
```

---

## 🧪 Features

* 🧠 Chat with context-aware responses from your uploaded PDFs
* ⚡ WebSocket-powered live upload statuses
* 📚 Supabase-managed vector search
* 🔐 Auth via Supabase (Email + GitHub)
* 📤 Resumable PDF uploads using TUS

---

## 🧰 Useful Commands

| Command                   | Description                 |
| ------------------------- | --------------------------- |
| `supabase start`          | Start Supabase locally      |
| `supabase db reset`       | Reset DB and run migrations |
| `docker compose up redis` | Start only Redis            |
| `npm run dev`             | Run Next.js dev server      |
| `npm run start:worker`    | Run BullMQ embedding worker |
| `npm run start:socket`    | Run Socket.IO server        |

---

## 🧠 Notes

* `@supabase/ssr` must **not** be used in Edge Middleware until officially supported
* Docker will not build the full app until this is addressed
* Redis **must** be running before starting the worker or socket

---

