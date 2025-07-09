# --- Dockerfile ---
FROM node:20-alpine

WORKDIR /app

# Copy and install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy the rest of the app (including src/, public/, etc.)
COPY . .

# Expose port
EXPOSE 3000

CMD ["npm", "run", "dev"]