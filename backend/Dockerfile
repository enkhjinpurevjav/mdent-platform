# Backend API (Node.js + Prisma), no dist copy, ts-node fallback
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:18-alpine AS build
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate || (echo "warn: prisma generate failed at build, will retry at runtime" && exit 0)

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY package*.json ./
COPY src ./src
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 8080
ENTRYPOINT ["/entrypoint.sh"]
