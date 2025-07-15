FROM node:20-alpine

# Accept Supabase secrets as build arguments
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

# Make them available as env vars during build
ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY

# Set working directory
WORKDIR /app

# Install OS deps if needed (for PDF, etc.)
RUN apk add --no-cache libc6-compat python3 make g++ && npm i -g pnpm

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install all deps (not just prod)
RUN npm install

# Copy source code
COPY . .

# Expose Next.js dev port
EXPOSE 3000 3001

# Start the dev server for web, socket, and worker in parallel
CMD ["sh", "-c", "npm run dev & npm run start:worker & npm run start:socket && wait"]
