# 📦 Friendshostel Deployment Guide

Полное руководство по деплою на сервер **186.246.2.35** с доменом **domainandpunch.ru**

## 📋 Требования

- Сервер с Ubuntu 20.04+ или Debian 11+
- SSH доступ с правами root
- Открытые порты 80 (HTTP) и 443 (HTTPS)

## 🚀 Быстрый старт

### 1️⃣ Подключитесь к серверу

```bash
ssh root@186.246.2.35
# Пароль: jGt_5QjHna4Dc-
```

### 2️⃣ Загрузите и запустите deployment скрипт

```bash
cd /tmp
wget https://raw.githubusercontent.com/yourusername/friendshostel/main/deploy.sh
chmod +x deploy.sh
sudo bash deploy.sh
```

Или клонируйте репозиторий и запустите скрипт:

```bash
git clone https://github.com/yourusername/friendshostel.git
cd friendshostel
sudo bash deploy.sh
```

## 🌐 DNS конфигурация

После успешного деплоя обновите DNS записи у вашего регистратора:

| Тип | Имя | Значение | TTL |
|-----|-----|---------|-----|
| A | `domainandpunch.ru` | `186.246.2.35` | 300 |
| A | `api.domainandpunch.ru` | `186.246.2.35` | 300 |

### Проверка DNS

```bash
# Linux/macOS
nslookup domainandpunch.ru
nslookup api.domainandpunch.ru

# Или через dig
dig domainandpunch.ru
dig api.domainandpunch.ru
```

## 🔒 SSL/HTTPS (Let's Encrypt)

Traefik автоматически получает SSL сертификаты от Let's Encrypt при первом обращении к доменам.

### Проверка сертификатов

```bash
# Зайти на сервер
ssh root@186.246.2.35

# Проверить сертификаты
docker exec traefik cat /letsencrypt/acme.json | jq '.Certificates'

# Или просмотреть логи
docker-compose -f docker-compose.yml.prod logs traefik | grep -i certificate
```

### Когда сертификаты не получены?

Если сертификаты не получены, проверьте:

1. **DNS пропагация** (может занять до 48 часов)
   ```bash
   # Проверьте, что DNS правильно указывает на сервер
   nslookup api.domainandpunch.ru
   ```

2. **Открыты ли порты?**
   ```bash
   netstat -tlnp | grep -E ':(80|443)'
   ```

3. **Логи Traefik**
   ```bash
   docker-compose -f docker-compose.yml.prod logs -f traefik
   ```

4. **Перезагрузите Traefik вручную**
   ```bash
   docker-compose -f docker-compose.yml.prod restart traefik
   ```

## 🛠️ Управление сервисами

### Просмотр статуса

```bash
cd /opt/friendshostel
docker-compose -f docker-compose.yml.prod ps
```

### Просмотр логов

```bash
# Все сервисы
docker-compose -f docker-compose.yml.prod logs -f

# Конкретный сервис
docker-compose -f docker-compose.yml.prod logs -f cms
docker-compose -f docker-compose.yml.prod logs -f front
docker-compose -f docker-compose.yml.prod logs -f traefik
```

### Перезагрузка сервиса

```bash
docker-compose -f docker-compose.yml.prod restart cms
docker-compose -f docker-compose.yml.prod restart front
docker-compose -f docker-compose.yml.prod restart traefik
```

### Остановка всех сервисов

```bash
docker-compose -f docker-compose.yml.prod down
```

### Запуск всех сервисов

```bash
docker-compose -f docker-compose.yml.prod up -d
```

## 📚 Структура проекта на сервере

```
/opt/friendshostel/
├── cms/                      # Strapi CMS
│   ├── .env                  # ⚠️ НЕ коммитить в git
│   ├── public/uploads/       # Загрузки
│   └── ...
├── front/                    # Next.js фронтенд
│   ├── .env.local            # ⚠️ НЕ коммитить в git
│   └── ...
├── docker-compose.yml.prod   # Production конфиг
├── letsencrypt/              # SSL сертификаты (автоген)
├── var/pg/                   # PostgreSQL данные (volume)
└── traefik/                  # Traefik конфиги
```

## 🚨 Troubleshooting

### Сервис не запускается

```bash
# Проверьте логи
docker-compose -f docker-compose.yml.prod logs <service>

# Проверьте конфиг
docker-compose -f docker-compose.yml.prod config

# Пересоберите образ
docker-compose -f docker-compose.yml.prod build --no-cache <service>
```

### PostgreSQL не коннектится

```bash
# Проверьте статус БД
docker exec postgres pg_isready -U friends -d friends

# Проверьте переменные окружения
docker exec postgres env | grep POSTGRES
```

### Traefik не маршрутизирует трафик

```bash
# Проверьте роутеры
docker exec traefik traefik-config list http.routers

# Проверьте сервисы
docker exec traefik traefik-config list http.services
```

### Диск заполнен

```bash
# Проверьте использование дискового пространства
df -h

# Очистите неиспользуемые Docker образы
docker image prune -a

# Очистите неиспользуемые контейнеры
docker container prune
```

## 📊 Мониторинг

### Traefik Dashboard (локально)

```bash
# Доступен только на localhost:8085
# Для доступа через SSH tunnel:
ssh -L 8085:localhost:8085 root@186.246.2.35

# Затем откройте в браузере: http://localhost:8085
```

### Основные метрики

```bash
# CPU и память
docker stats

# Размер образов
docker images

# Размер контейнеров
docker ps -a -s
```

## 🔄 Обновления и деплой

### Обновить код и перезагрузить сервисы

```bash
cd /opt/friendshostel
git pull origin main
docker-compose -f docker-compose.yml.prod build
docker-compose -f docker-compose.yml.prod up -d
```

### Откатиться на предыдущую версию

```bash
cd /opt/friendshostel
git checkout HEAD~1
docker-compose -f docker-compose.yml.prod build
docker-compose -f docker-compose.yml.prod up -d
```

## 🔐 Безопасность

### Измените пароли перед деплоем!

**cms/.env:**
```bash
# Сгенерируйте новые секреты
openssl rand -base64 32
```

Обновите в `.env`:
- `APP_KEYS` - минимум 4 ключа, разделенные запятой
- `API_TOKEN_SALT` - случайная строка
- `ADMIN_JWT_SECRET` - случайная строка
- `TRANSFER_TOKEN_SALT` - случайная строка
- `JWT_SECRET` - случайная строка
- `DATABASE_PASSWORD` - новый пароль PostgreSQL

### Firewall правила

```bash
# Разрешить только необходимые порты
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable
```

### Резервные копии БД

```bash
# Создать резервную копию
docker exec postgres pg_dump -U friends friends > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из резервной копии
docker exec -i postgres psql -U friends friends < backup_20240516_120000.sql
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose -f docker-compose.yml.prod logs -f`
2. Проверьте DNS пропагацию
3. Убедитесь, что порты 80 и 443 открыты
4. Проверьте конфиги в `docker-compose.yml.prod`

---

**Создано:** 2024
**Домен:** domainandpunch.ru
**API:** api.domainandpunch.ru
**Сервер:** 186.246.2.35
