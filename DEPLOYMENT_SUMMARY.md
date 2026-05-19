# 🚀 Friendshostel Deployment Summary

Complete deployment package for your Node.js services on **186.246.2.35** with domain **domainandpunch.ru**.

## 📦 What's Included

### 1. **Deployment Scripts**
- **[deploy.sh](deploy.sh)** - Automated deployment script (8 steps)
  - Updates system packages
  - Installs Docker & Docker Compose
  - Clones repository
  - Creates environment files
  - Starts containers
  - Verifies all services
- **[setup-ssl.sh](setup-ssl.sh)** - Manual SSL certificate trigger

### 2. **Configuration Files Updated**
- ✅ [docker-compose.yml.prod](docker-compose.yml.prod) - Production configuration
- ✅ [docker-compose.yml.local](docker-compose.yml.local) - Local development configuration
- ✅ [front/Dockerfile](front/Dockerfile) - Frontend build with new domain
- ✅ [front/next.config.ts](front/next.config.ts) - Image domains configuration
- ✅ [traefik/dynamic/services.yml](traefik/dynamic/services.yml) - Traefik routing rules
- ✅ [cms/.env.example](cms/.env.example) - Updated environment template
- ✅ [.gitignore](.gitignore) - Improved ignore rules
- ✅ [.dockerignore](.dockerignore) - Docker build optimization

### 3. **Documentation**
- **[DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)** - Step-by-step deployment guide
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Pre-deployment verification checklist
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Common commands reference

---

## 🌐 Architecture

```
Internet
   ↓
Port 80 (HTTP)   ← Auto-redirect to HTTPS
Port 443 (HTTPS)
   ↓
Traefik (Reverse Proxy with SSL)
   ├─ domainandpunch.ru      → Front (Next.js) Port 3000
   └─ api.domainandpunch.ru  → CMS (Strapi) Port 1337
   ↓
PostgreSQL Database (Port 5432, Docker network only)
```

---

## 🎯 Quick Start (5 Steps)

### Step 1: SSH to Server
```bash
ssh root@186.246.2.35
# Password: jGt_5QjHna4Dc-
```

### Step 2: Clone Repository
```bash
git clone https://github.com/yourusername/friendshostel.git /opt/friendshostel
cd /opt/friendshostel
```

### Step 3: Configure Environment
```bash
cp cms/.env.example cms/.env
nano cms/.env
# Update: APP_KEYS, secrets, database password
chmod 600 cms/.env
```

### Step 4: Run Deployment Script
```bash
chmod +x deploy.sh
sudo bash deploy.sh
```

### Step 5: Update DNS
At your domain registrar:
```
domainandpunch.ru     A 186.246.2.35
api.domainandpunch.ru A 186.246.2.35
```

Then test (after DNS propagation):
```bash
curl https://domainandpunch.ru
curl https://api.domainandpunch.ru/api
```

---

## 📊 Services Configuration

| Service | Domain | Port | Docker Network |
|---------|--------|------|-----------------|
| **Traefik** | - | 80, 443 | web |
| **Front (Next.js)** | domainandpunch.ru | 3000 | web |
| **CMS (Strapi)** | api.domainandpunch.ru | 1337 | web |
| **PostgreSQL** | localhost | 5432 | web (internal only) |
| **Cron Caller** | - | - | host |

---

## 🔐 Security Features

✅ **HTTPS/SSL** - Let's Encrypt (automatic renewal)
✅ **Traefik** - Reverse proxy with rate limiting
✅ **Environment Isolation** - Database on Docker network only
✅ **Resource Limits** - CPU and memory capped
✅ **Auto-Restart** - Containers restart on failure
✅ **Health Checks** - PostgreSQL health verification
✅ **Firewall Ready** - Only ports 80, 443, 22 exposed

---

## 📈 Infrastructure Specs

```yaml
Server IP: 186.246.2.35
OS: Ubuntu 20.04+ or Debian 11+

Docker Resources:
  CMS:   0.76 CPU, 768MB RAM
  Front: 0.76 CPU, 768MB RAM
  DB:    Unlimited (adjust as needed)

Storage:
  Database: ./var/pg/
  Uploads:  ./cms/public/uploads/
  SSL:      ./letsencrypt/
```

---

## 🛠️ Maintenance Commands

### View Status
```bash
cd /opt/friendshostel
docker-compose -f docker-compose.yml.prod ps
docker-compose -f docker-compose.yml.prod logs -f
```

### Restart Services
```bash
docker-compose -f docker-compose.yml.prod restart cms
docker-compose -f docker-compose.yml.prod restart front
```

### Database Backup
```bash
docker exec postgres pg_dump -U friends friends > backup_$(date +%Y%m%d).sql
```

### Update Application
```bash
git pull origin main
docker-compose -f docker-compose.yml.prod build
docker-compose -f docker-compose.yml.prod up -d
```

---

## ⚠️ Important Notes

### Before Deployment

1. **Update sensitive values** in `cms/.env`:
   ```bash
   APP_KEYS="key1,key2,key3,key4"  # Use: openssl rand -base64 32
   API_TOKEN_SALT="random"
   ADMIN_JWT_SECRET="random"
   DATABASE_PASSWORD="strong_password"
   ```

2. **Update email** in `docker-compose.yml.prod` for Let's Encrypt

3. **Set up DNS records** BEFORE running the deployment script

4. **Ensure ports 80 and 443** are open on the firewall

### After Deployment

1. **Wait for SSL certificates** (5-10 minutes after deployment)
   - Let's Encrypt needs DNS resolution
   - Check logs: `docker-compose logs traefik`

2. **Test both domains**:
   ```bash
   curl -v https://domainandpunch.ru
   curl -v https://api.domainandpunch.ru
   ```

3. **Monitor logs** for first 24 hours:
   ```bash
   docker-compose -f docker-compose.yml.prod logs -f
   ```

---

## 📚 Documentation Guide

| Document | Purpose |
|----------|---------|
| [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md) | Complete step-by-step guide with troubleshooting |
| [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) | Pre-deployment verification & monitoring setup |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Common commands for daily operations |

---

## 🔗 Domain Configuration

```
Frontend:
  URL: https://domainandpunch.ru
  Port: 3000 (Docker) → 443 (Traefik)
  
API/CMS:
  URL: https://api.domainandpunch.ru
  Port: 1337 (Docker) → 443 (Traefik)
  
Frontend API connection:
  API_URL: https://api.domainandpunch.ru/api
  ADMIN_URL: https://api.domainandpunch.ru
```

---

## 📞 Support & Troubleshooting

### Common Issues

**SSL certificate not generated:**
- Check DNS propagation: `nslookup domainandpunch.ru`
- Check ports open: `netstat -tlnp | grep -E ':(80|443)'`
- Check logs: `docker-compose logs traefik`

**Services won't start:**
- Check docker: `docker --version`
- Check compose: `docker-compose --version`
- Check .env file: `cat cms/.env`
- Check logs: `docker-compose logs`

**Database connection failed:**
- Verify credentials in `.env`
- Check PostgreSQL running: `docker ps | grep postgres`
- Check network: `docker network ls`

See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for debugging commands.

---

## ✅ Deployment Checklist

Before running `deploy.sh`:
- [ ] SSH key ready
- [ ] .env file configured with secrets
- [ ] Docker installed on server (or script will install it)
- [ ] Ports 80, 443 open
- [ ] DNS records created (can be after deployment)
- [ ] Repository cloned to `/opt/friendshostel`

---

## 🎓 Learning Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Traefik Documentation](https://doc.traefik.io/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PostgreSQL Backup Guide](https://www.postgresql.org/docs/current/backup.html)

---

## 📝 File Structure

```
/opt/friendshostel/
├── cms/                          # Strapi CMS
│   ├── .env                      # Environment variables (not in git)
│   ├── .env.example              # Template
│   ├── Dockerfile
│   ├── package.json
│   └── src/
├── front/                        # Next.js Frontend
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── package.json
│   ├── app/
│   └── public/
├── cron-caller/                  # Cron service
│   ├── Dockerfile
│   └── call_api.sh
├── traefik/                      # Reverse proxy config
│   ├── acme.json                 # SSL certificates (auto-generated)
│   └── dynamic/services.yml
├── docker-compose.yml.prod       # Production compose file
├── docker-compose.yml.local      # Local compose file
├── deploy.sh                     # Deployment script
├── setup-ssl.sh                  # SSL setup script
├── letsencrypt/                  # SSL certificates (auto-generated)
│   └── acme.json
├── var/pg/                       # PostgreSQL data (volume)
├── DEPLOY_INSTRUCTIONS.md        # Deployment guide
├── PRODUCTION_CHECKLIST.md       # Verification checklist
├── QUICK_REFERENCE.md            # Commands reference
└── .gitignore                    # Git exclusions
```

---

## 🎉 You're Ready!

All files are configured and ready for deployment to **186.246.2.35** with domain **domainandpunch.ru**.

**Next Step:** Follow [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md) to deploy!

---

**Created:** 2024-05-16
**Version:** 1.0
**Status:** Ready for Production
