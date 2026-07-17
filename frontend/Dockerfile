# =============================================================================
# PetCare Frontend — Multi-stage Dockerfile
# =============================================================================
# Targets:
#   dev   — Hot-reload development server (Vite HMR)
#   prod  — Optimized production build served by Vite preview
#
# Usage:
#   docker build --target dev  -t petcare-frontend:dev  .
#   docker build --target prod -t petcare-frontend:prod .
# =============================================================================

# ---------------------------------------------------------------------------
# Base — shared system dependencies
# ---------------------------------------------------------------------------
FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./

# ---------------------------------------------------------------------------
# Dependencies — all packages (dev + production)
# ---------------------------------------------------------------------------
FROM base AS deps

RUN npm ci

# ---------------------------------------------------------------------------
# Build — compile TypeScript and bundle with Vite
# ---------------------------------------------------------------------------
FROM deps AS build

# Vite bakes VITE_* environment variables into the bundle at build time.
# These are provided as Docker build arguments.
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

RUN npm run build

# ---------------------------------------------------------------------------
# Development — hot-reload with Vite dev server
# ---------------------------------------------------------------------------
FROM deps AS dev

COPY . .

EXPOSE 5173

ENV NODE_ENV=development

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------------------------------------------------------------------------
# Production — serve the optimized build
# ---------------------------------------------------------------------------
FROM node:22-alpine AS prod

WORKDIR /app

# Copy the built assets from the build stage
COPY --from=build /app/dist ./dist

# Copy package.json and vite config so we can use vite preview
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/vite.config.ts ./vite.config.ts

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

ENV NODE_ENV=production

# Use Vite's built-in preview server to serve the static build
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "8080"]
