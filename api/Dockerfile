# ─── Stage 1: deps ───────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

# Sharp needs libc-compatible binaries; use the vips binaries baked into alpine
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

COPY package.json yarn.lock ./

# Install ALL deps (including devDeps needed for build & prisma generate)
RUN yarn install --frozen-lockfile

# Copy prisma schema and migrations so the client can be generated
COPY prisma ./prisma
RUN yarn prisma:generate


# ─── Stage 2: builder ────────────────────────────────────────────────────────
FROM deps AS builder

WORKDIR /app

COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript → dist/
RUN yarn build


# ─── Stage 3: runner (minimal production image) ──────────────────────────────
FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat tini curl openssl

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 appuser

WORKDIR /app

# Copy only production artifacts
COPY --from=builder  --chown=appuser:nodejs /app/dist           ./dist
COPY --from=deps     --chown=appuser:nodejs /app/node_modules   ./node_modules
COPY --from=builder  --chown=appuser:nodejs /app/prisma         ./prisma
COPY                 --chown=appuser:nodejs package.json        ./

# Upload directory (persisted via a named volume in compose)
RUN mkdir -p public/uploads/cabins public/uploads/avatars \
 && chown -R appuser:nodejs public/

USER appuser

EXPOSE 3000

# tini as PID 1 for proper signal handling
ENTRYPOINT ["/sbin/tini", "--"]

# Run DB migrations then start the API server
CMD ["sh", "-c", "node node_modules/.bin/prisma migrate deploy && node dist/server.js"]
