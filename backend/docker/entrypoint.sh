#!/usr/bin/env sh
set -e

echo "[backend] Prisma generate (runtime) ..."
npx prisma generate || echo "[backend] prisma generate failed, continuing"

echo "[backend] Running prisma migrate deploy ..."
npx prisma migrate deploy || echo "[backend] migrate deploy failed or no migrations yet"

if [ "${RUN_SEED:-false}" = "true" ]; then
  if [ -f "prisma/seed.js" ]; then
    echo "[backend] Running seed.js ..."
    node prisma/seed.js || echo "[backend] seed.js failed"
  elif [ -f "prisma/seed.ts" ]; then
    echo "[backend] Running seed.ts ..."
    node --loader ts-node/esm prisma/seed.ts || echo "[backend] seed.ts failed"
  else
    echo "[backend] No seed file found; skipping"
  fi
fi

START_CMD="node dist/index.js"
if [ ! -f "dist/index.js" ]; then
  echo "[backend] dist/index.js not found; launching via ts-node"
  START_CMD="npx ts-node src/index.ts"
fi

echo "[backend] Starting app: $START_CMD"
exec sh -c "$START_CMD"
