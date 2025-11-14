# Backend API (Node.js + Prisma) with Alpine fix for Prisma generate
# Quick-fix: don't COPY dist; rely on ts-node fallback at runtime

FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Install devDependencies so prisma CLI and ts-node are available
RUN npm install

FROM node:18-alpine AS build
WORKDIR /app
# Alpine libs often needed by Prisma
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
# Try prisma generate at build-time; if it fails here, we'll retry at runtime
RUN npx prisma generate || (echo "warn: prisma generate failed at build, will retry at runtime" && exit 0)
# If you later add a TS compile step, you can enable:
# RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy runtime deps and app sources
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
COPY src ./src
# NOTE: intentionally NOT copying /app/dist to avoid build failure when it doesn't exist

# Entrypoint handles prisma generate + migrate + seed + start (ts-node fallback)
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
