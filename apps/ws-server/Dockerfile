FROM node:20-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ws-server/package.json ./apps/ws-server/
COPY packages/shared/package.json ./packages/shared/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY apps/ws-server ./apps/ws-server
COPY packages/shared ./packages/shared

WORKDIR /app/apps/ws-server
RUN pnpm build

EXPOSE 3001
CMD ["node", "dist/index.js"]
