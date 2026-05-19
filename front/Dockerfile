# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

ARG API_URL=https://admin.friendshostel.ge/api
ARG ADMIN_URL=https://admin.friendshostel.ge
ENV API_URL=$API_URL
ENV ADMIN_URL=$ADMIN_URL

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json и lock-файл
COPY package.json pnpm-lock.yaml ./

# Устанавливаем зависимости
RUN pnpm install

# Копируем весь проект
COPY . .

# Собираем Next.js
RUN pnpm run build

# ---------- RUNTIME STAGE ----------
FROM node:20-alpine

WORKDIR /app

ARG API_URL=https://admin.friendshostel.ge/api
ARG ADMIN_URL=https://admin.friendshostel.ge
ENV API_URL=$API_URL
ENV ADMIN_URL=$ADMIN_URL
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
