FROM node:20-bookworm as base

FROM base as builder
RUN apt update
WORKDIR /app
RUN npm install --global turbo
COPY . .
RUN turbo prune --scope=api --docker
# remove all empty node_modules folder structure
RUN rm -rf /app/out/full/*/*/node_modules

FROM base AS installer
WORKDIR /app

RUN apt update
RUN npm install --global pnpm && npm install --global turbo

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm fetch
RUN pnpm install --frozen-lockfile
COPY --from=builder /app/out/full/ .

COPY turbo.json turbo.json
RUN turbo run build --filter=api

# FROM base AS runner
# WORKDIR /app
# RUN apt update
# COPY --from=builder /app/apps/api/ .

WORKDIR /app/apps/api
#   EXPOSE 8000
CMD ["npm","run", "prod"]