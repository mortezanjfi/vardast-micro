# Use a Node.js base image with Yarn installed
FROM node:20.10.0-alpine as base

RUN apk add openssl

RUN npm i -g pnpm@8.7.4 ts-node turbo@latest

USER root

ARG PROJECT_NAME_AUTHENTICATION=authentication
ARG PROJECT_NAME_ADMIN=vardast-admin
ARG PROJECT_NAME_CLIENT=vardast-client
ARG PROJECT_NAME_SELLER=vardast-seller
ARG BUILD_MODE

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune ${PROJECT_NAME_ADMIN} ${PROJECT_NAME_SELLER} ${PROJECT_NAME_AUTHENTICATION} ${PROJECT_NAME_CLIENT} --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/create-auth.js .
RUN pnpm create-auth
RUN rm -rf apps/authentication

# COPY --from=builder /app/out/pnpm-lock ./pnpm-lock
RUN pnpm install
 
RUN cp apps/${PROJECT_NAME_ADMIN}/.env.${BUILD_MODE} apps/${PROJECT_NAME_ADMIN}/.env
RUN cp apps/${PROJECT_NAME_SELLER}/.env.${BUILD_MODE} apps/${PROJECT_NAME_SELLER}/.env
RUN cp apps/${PROJECT_NAME_CLIENT}/.env.${BUILD_MODE} apps/${PROJECT_NAME_CLIENT}/.env
RUN cp packages/graphql/.env.${BUILD_MODE} packages/graphql/.env


# Build the project
RUN pnpm build
 
FROM base AS runner
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
 

COPY --from=installer /app/ .


CMD ["pnpm", "start"]