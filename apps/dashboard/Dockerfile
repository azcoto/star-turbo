FROM node:20-bookworm as base

FROM base as builder
RUN apt update
WORKDIR /app
RUN npm install --global turbo

COPY . .
RUN turbo prune --scope=dashboard --docker
RUN rm -rf /app/out/full/*/*/node_modules

FROM base AS installer
RUN apt update
WORKDIR /app
RUN npm install --global pnpm && npm install --global turbo

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch
RUN pnpm install
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN turbo run build --filter=dashboard

# Don't run production as root
FROM nginx:stable-alpine AS nginx
WORKDIR /app
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=installer --chown=node:nodejs /app/apps/dashboard/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;" ]