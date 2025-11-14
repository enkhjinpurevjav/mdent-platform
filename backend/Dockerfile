# Backend API (Node.js + Prisma) with auto-migrate and optional seed

FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
# If you later add a build step (e.g., tsc), uncomment:
# RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy runtime deps and app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
# Copy built dist if exists; otherwise we will ts-node run
COPY --from=build /app/dist ./dist || true
COPY src ./src

# Entrypoint (handles migrate + seed + start)
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
