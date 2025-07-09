# 🧠 RAG App – Next.js + Supabase + Docker

This is a Retrieval-Augmented Generation (RAG) application scaffold, built using:

* **Next.js** with TypeScript
* **Supabase** for auth, database, and realtime
* **Docker** (for optional containerization)
* **Supabase CLI** for running a full local backend stack

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/soofye/rag-app.git
cd rag-app
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Install Supabase CLI (if not installed)

#### On Windows (via Scoop)

```bash
scoop install supabase
```

> If you don’t have Scoop, install it from: [https://scoop.sh](https://scoop.sh)

#### macOS/Linux

Follow instructions at:
👉 [https://github.com/supabase/cli#install-the-cli](https://github.com/supabase/cli#install-the-cli)

---

### 4. Initialize and Start Supabase Locally

```bash
supabase init
supabase start
```

This will spin up:

* Supabase DB
* Auth
* Realtime
* Storage
* REST API
* Studio UI (at [http://localhost:54323](http://localhost:54323))

---

### 5. Set Up `.env.local`

Create a file called `.env.local` in the root of your project:

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

You can get your `anon` key from:

```bash
supabase status
```

or from the generated `supabase/.env`.

---

### 6. Start the App (Development Mode)

```bash
npm run dev
```

Visit your app at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🐳 Optional: Run Next.js via Docker

You can containerize your frontend:

### 1. Build the Docker Image

```bash
docker-compose up --build
```

### 2. Visit the App

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Next Steps

* Add file upload & text embedding
* Integrate vector search (e.g., pgvector or external)
* Add user authentication & session handling
---

## 📎 Useful Links

* [Supabase Docs](https://supabase.com/docs)
* [Supabase CLI](https://github.com/supabase/cli)
* [Next.js Docs](https://nextjs.org/docs)

