# -------------------------
# Stage 1 — builder
# -------------------------
FROM node:20-bookworm AS builder

WORKDIR /app

# Инструменты сборки для native модулей (better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 \
    libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libxrender1 \
    libasound2 libpangocairo-1.0-0 libpango-1.0-0 libcairo2 \
    libatspi2.0-0 libgtk-3-0 fonts-liberation fonts-noto-color-emoji \
    libgbm1 wget ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем только lock-файлы!
#COPY package.json pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm store prune || true
RUN pnpm store path && rm -rf $(pnpm store path)/* || true

RUN pnpm install --include=optional

# Устанавливаем Chromium Playwright
RUN pnpm exec playwright install --with-deps chromium

# Копируем весь проект
COPY . .

# Собираем Strapi или проект
ENV NODE_ENV=production
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm run build


# -------------------------
# Stage 2 — runtime
# -------------------------
FROM node:20-bookworm-slim AS runtime

WORKDIR /app

# Runtime deps для Chromium


RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxrender1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    fonts-liberation \
    fonts-noto-color-emoji \
    libsqlite3-0 \
    libgbm1 \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

# Копируем собранный проект
COPY --from=builder /app /app

# Кэш playwright браузеров
COPY --from=builder /root/.cache /root/.cache

ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/root/.cache/ms-playwright
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

EXPOSE 1337

CMD ["pnpm", "start"]
