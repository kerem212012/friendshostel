# ✅ Production Deployment Checklist

Use this checklist to ensure your deployment is ready for production.

## 📋 Pre-Deployment Checks

### Environment Configuration
- [ ] **CMS .env file exists** - `cms/.env` (not committed)
  ```bash
  cp cms/.env.example cms/.env
  ```
- [ ] **All secret keys updated** in `cms/.env`
  ```bash
  # Generate: openssl rand -base64 32
  APP_KEYS=<four-random-keys>
  API_TOKEN_SALT=<random>
  ADMIN_JWT_SECRET=<random>
  TRANSFER_TOKEN_SALT=<random>
  JWT_SECRET=<random>
  ENCRYPTION_KEY=<random>
  ```
- [ ] **Database credentials updated** in `cms/.env`
  ```bash
  DATABASE_PASSWORD=<strong-password>
  ```
- [ ] **Environment set to production**: `NODE_ENV=production`

### Docker Configuration
- [ ] **Using production docker-compose**: `docker-compose.yml.prod`
- [ ] **Traefik SSL resolver configured**
  - Email for Let's Encrypt: `maksfedorov@gmail.com` → Update to your email
  - Certificate storage path: `/letsencrypt/acme.json`
- [ ] **Resource limits set** (CPU, Memory)
  - CMS: 0.76 CPU, 768MB RAM
  - Front: 0.76 CPU, 768MB RAM

### Domain Configuration
- [ ] **Domains updated** in all config files:
  - Front domain: `domainandpunch.ru`
  - API domain: `api.domainandpunch.ru`
  - Updated in: `docker-compose.yml.prod`, `docker-compose.yml.local`, `front/Dockerfile`, `traefik/dynamic/services.yml`
- [ ] **Email in Traefik config** updated for Let's Encrypt

### Server Setup
- [ ] **Server IP**: `186.246.2.35`
- [ ] **SSH access**: `ssh root@186.246.2.35`
- [ ] **Ports open**: 80 (HTTP), 443 (HTTPS), 22 (SSH)
- [ ] **Docker installed**: `docker --version`
- [ ] **Docker Compose installed**: `docker-compose --version`
- [ ] **Git installed**: `git --version`

### DNS Setup
- [ ] **DNS records created** at registrar:
  ```
  domainandpunch.ru A 186.246.2.35
  api.domainandpunch.ru A 186.246.2.35
  ```
- [ ] **DNS propagation checked** (wait up to 48 hours):
  ```bash
  nslookup domainandpunch.ru
  nslookup api.domainandpunch.ru
  ```

### SSL/HTTPS Setup
- [ ] **Let's Encrypt account email** configured
- [ ] **Firewall rules allowing** port 80 and 443
- [ ] **Certificate storage** directory permissions correct: `/letsencrypt/`

## 🚀 Deployment Steps

### Step 1: Connect to Server
```bash
ssh root@186.246.2.35
```

### Step 2: Clone Repository
```bash
git clone https://github.com/yourusername/friendshostel.git /opt/friendshostel
cd /opt/friendshostel
```

### Step 3: Setup Environment
```bash
# Copy and configure environment file
cp cms/.env.example cms/.env
# Edit cms/.env with real values
nano cms/.env
```

### Step 4: Start Services
```bash
docker-compose -f docker-compose.yml.prod up -d
```

### Step 5: Verify Services
```bash
docker-compose -f docker-compose.yml.prod ps
docker-compose -f docker-compose.yml.prod logs
```

### Step 6: Test SSL (after DNS propagation)
```bash
bash setup-ssl.sh
# Or manually
curl -I https://domainandpunch.ru
curl -I https://api.domainandpunch.ru
```

## 📊 Post-Deployment Verification

### Services Running
- [ ] **Traefik**: `docker ps | grep traefik`
- [ ] **CMS**: `docker ps | grep cms`
- [ ] **Front**: `docker ps | grep front`
- [ ] **PostgreSQL**: `docker ps | grep postgres`

### Connectivity Tests
```bash
# Test frontend
curl -I https://domainandpunch.ru

# Test API
curl -I https://api.domainandpunch.ru

# Test API endpoint
curl -s https://api.domainandpunch.ru/api/admin | head
```

### Certificate Verification
```bash
# Check certificates installed
docker exec traefik cat /letsencrypt/acme.json | jq '.Certificates'

# Check certificate expiration
echo | openssl s_client -servername domainandpunch.ru -connect 186.246.2.35:443 2>/dev/null | \
  openssl x509 -noout -dates
```

### Database Status
```bash
# Check PostgreSQL connection
docker exec postgres pg_isready -U friends -d friends

# Check database size
docker exec postgres psql -U friends -d friends -c "SELECT pg_size_pretty(pg_database_size('friends'));"
```

### Application Status
```bash
# Check frontend build
docker exec front npm --version

# Check CMS server
docker exec cms curl -s http://localhost:1337/admin | head

# Check API health
docker exec cms curl -s http://localhost:1337/api/admin/health
```

## 🔐 Security Checks

### File Permissions
- [ ] **`.env` file permissions**: `600` (not readable by others)
  ```bash
  chmod 600 cms/.env
  ```
- [ ] **SSL directory permissions**: `600`
  ```bash
  chmod 600 letsencrypt
  ```

### Firewall Configuration
- [ ] **Only necessary ports open**:
  ```bash
  ufw allow 22/tcp   # SSH
  ufw allow 80/tcp   # HTTP
  ufw allow 443/tcp  # HTTPS
  ufw enable
  ```

### Secret Keys
- [ ] **All generated keys are unique** and strong
- [ ] **No default/example keys in production**
- [ ] **Secrets not in git history**:
  ```bash
  git log --all -S "toBeModified" # Should be empty
  ```

### Database Security
- [ ] **Database password is strong**: 16+ characters, mixed case/numbers/symbols
- [ ] **Database port not exposed**: 54333 only to Docker network

## 📈 Monitoring Setup

### Log Rotation
- [ ] **Docker logs rotated** to prevent disk fill:
  ```json
  {
    "log-driver": "json-file",
    "log-opts": {
      "max-size": "10m",
      "max-file": "3"
    }
  }
  ```

### Backup Strategy
- [ ] **Database backups scheduled**:
  ```bash
  # Hourly backups
  0 * * * * docker exec postgres pg_dump -U friends friends > /backups/db_$(date +\%Y\%m\%d_\%H\%M\%S).sql
  ```

### Monitoring & Alerts
- [ ] **Container restart policy**: `unless-stopped`
- [ ] **Health checks configured**: For all critical services
- [ ] **Disk space monitoring**: Alert if > 80% full
- [ ] **Memory monitoring**: Alert if > 80% used

## 🔄 Maintenance Tasks

### Weekly
- [ ] Review logs for errors
- [ ] Check disk space: `df -h`
- [ ] Check memory usage: `docker stats`
- [ ] Verify SSL certificates validity: `docker ps | grep traefik`

### Monthly
- [ ] Backup database: `docker exec postgres pg_dump...`
- [ ] Update system packages: `apt update && apt upgrade`
- [ ] Review security settings
- [ ] Check for available Docker image updates

### Quarterly
- [ ] Review and rotate secrets if needed
- [ ] Disaster recovery test (restore from backup)
- [ ] Performance analysis and optimization
- [ ] Security audit

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Containers won't start | Check logs: `docker-compose logs` |
| SSL certificate not generated | Wait for DNS propagation, check port 80/443 |
| Database connection failed | Verify DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD |
| Frontend not loading | Check if front container is running and healthy |
| API returning 503 | Check if CMS container is running and database is accessible |
| Disk full | Run `docker system prune` to clean up unused images/containers |

## 📝 Additional Resources

- [Traefik Documentation](https://doc.traefik.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [PostgreSQL Backup Guide](https://www.postgresql.org/docs/current/backup-dump.html)

---

**Last Updated:** 2024-05-16
**Status:** Ready for Production Deployment
