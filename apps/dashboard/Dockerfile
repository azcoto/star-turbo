FROM node:20-bookworm as base

FROM base as builder
RUN apt update
WORKDIR /app
RUN npm install --global pnpm && npm install --global turbo && SHELL=bash pnpm setup && . /root/.bashrc
COPY . .
RUN turbo prune --scope=dashboard --docker


FROM builder AS installer
RUN apt update
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/apps/ .
RUN pnpm install
COPY turbo.json turbo.json
RUN turbo run build --filter=dashboard

FROM base AS runner
WORKDIR /app

# Don't run production as root
FROM nginx:stable-alpine AS nginx
WORKDIR /app
COPY nginx-default.conf /etc/nginx/conf.d/default.conf
COPY --from=installer --chown=node:nodejs /app/apps/dashboard/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;" ]