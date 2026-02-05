
# Stage 1: Build
FROM node:20-bookworm AS builder

WORKDIR /usr/src/app

# Install dependencies
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile && pnpm store prune

# Copy built TypeScript files
COPY dist ./dist
COPY prisma ./prisma
RUN pnpm prisma generate --schema=./prisma/schema

# Stage 2: Runtime
FROM node:20-bookworm
WORKDIR /usr/src/app

# Install only production dependencies
RUN npm install -g pnpm
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD ["pnpm", "run", "start"]