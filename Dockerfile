# Use a Node.js base image with Yarn installed
FROM node:20.10.0-alpine as base

RUN apk add openssl

RUN npm i -g pnpm@8.7.4 ts-node turbo

USER root

ARG PROJECT_NAME_ADMIN=@vardast/admin
ARG PROJECT_NAME_CLIENT=@vardast/client
ARG PROJECT_NAME_SELLER=@vardast/seller

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune ${PROJECT_NAME_ADMIN} ${PROJECT_NAME_CLIENT} ${PROJECT_NAME_SELLER} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/full/ .
# COPY --from=builder /app/out/pnpm-lock ./pnpm-lock
RUN pnpm install
 

# Build the project
RUN pnpm build
 
FROM base AS runner
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
 

COPY --from=installer /app/ .


CMD ["pnpm", "start"]