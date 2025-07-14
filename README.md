# 🧠 RAG Stack – Full-Stack AI Chat with Supabase, Workers, and File Uploads

This project is a full-stack RAG (Retrieval-Augmented Generation) application using:

- ⚙️ **Next.js 15** (with SSR + API routes)
- 🔐 **Supabase** (Auth, DB, Vector Embeddings)
- 🤖 **BullMQ Workers** for chunking & embedding PDFs
- 🔌 **Socket.IO** for upload status & real-time updates
- ☁️ **TUS** protocol for resumable file uploads
- 📦 **Docker** for running it all together

---

## 📦 Prerequisites

Before getting started, install the following:

- [Docker](https://www.docker.com/products/docker-desktop)
- [Node.js 20+](https://nodejs.org/en/)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

## 🛠️ 1. Setup Supabase Locally

This project uses Supabase locally with vector embeddings. Follow these steps:

### ✅ Install Supabase CLI

```bash
npm install -g supabase
````

### 📁 Clone the Repo

```bash
git clone https://github.com/yourusername/rag-stack.git
cd rag-stack
```

### ⚙️ Start Supabase Locally

```bash
supabase start
```

This will:

* Start a local Postgres + Supabase instance
* Run on port `54321`
* Use the config in `supabase/config.toml`

### 📥 Push the schema

```bash
supabase db reset
```

This will:

* Apply migrations
* Set up your vector tables
* Seed required SQL functions (like `match_document_chunks_vector`)

---

## ⚙️ 2. Environment Setup

Create a `.env.local` file and fill in the following:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-api-key
```

✅ You can find the Supabase keys by visiting [http://localhost:54323](http://localhost:54323) when `supabase start` is running.

---

## 🐳 3. Run Everything via Docker

This project includes a `Dockerfile` and `docker-compose.yml` to run:

* Next.js app (on port `3000`)
* WebSocket server (on port `4000`)
* Workers
* TUS upload handler

### 🔥 Build & Start

```bash
docker compose up --build
```

Once built, access the app at:

📍 [http://localhost:3000](http://localhost:3000)

---

## 🧪 4. Features

* 🧠 Chat with context-aware responses from your uploaded PDFs
* ⚡ WebSocket-powered live upload statuses
* 📚 Supabase-managed embeddings with real-time search
* 🔐 Auth via Supabase (Email + GitHub)
* 📤 Resume-safe PDF uploads using TUS

---

## 🧰 Useful Commands

| Command                     | Description                          |
| --------------------------- | ------------------------------------ |
| `supabase start`            | Start local Supabase dev instance    |
| `supabase db reset`         | Reset and apply latest migrations    |
| `docker compose up --build` | Build and run the app + worker stack |
| `npm run start:worker`      | Run embedding worker manually        |
| `npm run start:socket`      | Run Socket.IO server manually        |

---

## 📌 Notes

* Make sure Supabase is running **before** running Docker.
* Worker processes and WebSockets are started from the same Docker container.
* Use the Supabase Studio at [http://localhost:54323](http://localhost:54323) to inspect DBs or debug.

---


