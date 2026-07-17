# =============================================================================
# PetCare Backend — Multi-stage Dockerfile
# =============================================================================
# Targets:
#   dev   — Hot-reload development server (tsx watch)
#   prod  — Optimized production server (node dist/server.js)
#
# Usage:
#   docker build --target dev  -t petcare-backend:dev  .
#   docker build --target prod -t petcare-backend:prod .
# =============================================================================

# ---------------------------------------------------------------------------
# Base — shared system dependencies
# ---------------------------------------------------------------------------
FROM node:22-alpine AS base

# Install only essential runtime tools (no build toolchain needed —
# bcrypt ships pre-built binaries)
RUN apk add --no-cache tini

WORKDIR /app

COPY package.json package-lock.json ./

# ---------------------------------------------------------------------------
# Dependencies — all packages (dev + production)
# ---------------------------------------------------------------------------
FROM base AS deps

RUN npm ci

# ---------------------------------------------------------------------------
# Production dependencies — only runtime packages
# ---------------------------------------------------------------------------
FROM base AS prod-deps

RUN npm ci --omit=dev

# ---------------------------------------------------------------------------
# Build — compile TypeScript to JavaScript
# ---------------------------------------------------------------------------
FROM deps AS build

COPY . .

RUN npm run build

# ---------------------------------------------------------------------------
# Development — hot-reload with tsx watch
# ---------------------------------------------------------------------------
FROM deps AS dev

# Install wget for Docker health checks
RUN apk add --no-cache wget

COPY . .

EXPOSE 5000

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

# ---------------------------------------------------------------------------
# Production — run compiled JavaScript
# ---------------------------------------------------------------------------
FROM base AS prod

WORKDIR /app

# Copy production node_modules (pre-compiled native addons included)
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy compiled application code
COPY --from=build /app/dist ./dist

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 5000

ENV NODE_ENV=production

# Use tini as init to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]
