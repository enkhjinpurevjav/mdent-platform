# Backend API (Node.js + Prisma) with Alpine fix for Prisma generate

FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
# Use npm install (no lockfile assumed); includes devDependencies so prisma CLI is present
RUN npm install

FROM node:18-alpine AS build
WORKDIR /app
# Install system libs Prisma commonly needs on Alpine
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
# Run prisma generate during build (now system deps present)
RUN npx prisma generate || (echo "warn: prisma generate failed at build, will retry at runtime" && exit 0)
# If you add a TS build later, uncomment:
# RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Copy runtime deps and app files
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
COPY src ./src
# Copy dist if you compiled TS; otherwise ts-node fallback will be used by entrypoint
COPY --from=build /app/dist ./dist 2>/dev/null || true

# Entrypoint (handles prisma generate + migrate + optional seed + start)
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
