FROM node:20-bookworm
RUN npm install -g pnpm
RUN pnpm config set store-dir /workspace/node_modules/.pnpm-store
ENV DEVCONTAINER=true