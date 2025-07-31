# syntax=docker/dockerfile:1.4

# ==============================================================================
# STAGE 1: base
# Establishes the core environment with Node.js, pnpm, and Turbo.
# Using a minimal Alpine base image for a smaller final footprint. [5, 16]
# ==============================================================================
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Install essential compatibility libraries and enable pnpm via corepack. [16, 17]
RUN apk add --no-cache libc6-compat && corepack enable

# ==============================================================================
# STAGE 2: pruner
# Creates a pruned, partial monorepo containing only the necessary files
# for the target application, which is the key to Docker layer caching. [3]
# ==============================================================================
FROM base AS pruner
WORKDIR /app
# Install turbo globally within this stage to use the prune command.
RUN pnpm add --global turbo
# Copy the entire monorepo context. A.dockerignore file is critical here
# to exclude node_modules,.turbo, dist, etc. from the host.
COPY . .
# The scope must match the "name" field in the app's package.json.
# The --docker flag structures the output for optimal Docker caching. [18, 19]
ARG APP_NAME
RUN turbo prune ${APP_NAME} --docker

# ==============================================================================
# STAGE 3: installer
# Installs all dependencies (dev and prod) in a dedicated layer. This layer
# is only invalidated if the pruned pnpm-lock.yaml changes.
# ==============================================================================
FROM base AS installer
WORKDIR /app
# Copy only the package manifests and pruned lockfile from the pruner stage. [5, 16]
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml .
COPY --from=pruner /app/out/pnpm-workspace.yaml .
# Use BuildKit's cache mount for the pnpm store to dramatically speed up
# subsequent dependency installations. [5, 17, 20]
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
#RUN pnpm install --ignore-scripts

# ==============================================================================
# STAGE 4: builder
# Builds the application source code and then prunes development dependencies.
# ==============================================================================
FROM base AS builder
WORKDIR /app
ARG APP_NAME
# Copy the installed dependencies from the installer stage.
COPY --from=installer /app/ .
# Copy the pruned source code from the pruner stage.
COPY --from=pruner /app/out/full/ .
# Build the target application and its internal dependencies.
RUN pnpm add --global turbo && turbo run build --filter=${APP_NAME}
# CRUCIAL OPTIMIZATION: Remove all devDependencies from node_modules
# to significantly reduce the size of the final production image. [5, 17]
RUN pnpm prune --prod

# ==============================================================================
# STAGE 5: runner (Final Production Image)
# Creates the final, lean, and secure image containing only the necessary
# compiled code and production dependencies.
# ==============================================================================
# This stage is aliased as 'prod' for the --target flag
FROM base AS prod
WORKDIR /app
ARG APP_NAME
# Create a dedicated, non-root user for security best practices. [4, 5]
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs
# Copy only the essential, built artifacts from the builder stage.
# This includes the built code (dist), pruned node_modules, and package.json.
COPY --from=builder --chown=nodejs:nodejs /app/apps/${APP_NAME}/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/apps/${APP_NAME}/package.json .
# Set environment for production.
ENV NODE_ENV production
# Expose the port the application will run on.
EXPOSE 3000
# Define the command to start the application.
CMD ["node", "dist/app.js"]

# ==============================================================================
# STAGE 6: dev (Development Image)
# Creates a development-ready image with all dependencies installed and
# internal packages built, ready for source code volume mounting.
# ==============================================================================
# This stage is aliased as 'dev'
FROM installer AS dev
WORKDIR /app
ARG APP_NAME
# Copy the full pruned source code.
COPY --from=pruner /app/out/full/ .
# KEY DX OPTIMIZATION: Build only the *internal dependencies* of the app,
# not the app itself. The app's code will be mounted from the host.
# The `...^` syntax tells Turbo to build all dependencies of the target. [18, 19]
# turbo has cli which is used below
RUN pnpm add --global turbo && turbo run build --filter=${APP_NAME}^...
# The command to start the development server. -  maight be overriden in the docker-compose.yaml file!
CMD ["pnpm", "--filter", "${APP_NAME}", "run", "dev"]