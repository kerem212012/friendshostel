# 🔧 Quick Reference - Common Commands

## 📍 SSH Access

```bash
# Connect to server
ssh root@186.246.2.35

# Copy file to server
scp ./file.txt root@186.246.2.35:/opt/friendshostel/

# Download file from server
scp root@186.246.2.35:/opt/friendshostel/file.txt ./
```

## 🐳 Docker Commands

### Container Management

```bash
# Navigate to project
cd /opt/friendshostel

# Start all services
docker-compose -f docker-compose.yml.prod up -d

# Stop all services
docker-compose -f docker-compose.yml.prod down

# View running containers
docker-compose -f docker-compose.yml.prod ps

# Restart a service
docker-compose -f docker-compose.yml.prod restart cms
docker-compose -f docker-compose.yml.prod restart front
docker-compose -f docker-compose.yml.prod restart traefik

# View logs
docker-compose -f docker-compose.yml.prod logs -f              # All services
docker-compose -f docker-compose.yml.prod logs -f cms          # CMS only
docker-compose -f docker-compose.yml.prod logs -f front        # Front only
docker-compose -f docker-compose.yml.prod logs -f traefik      # Traefik only
docker-compose -f docker-compose.yml.prod logs -f postgres     # PostgreSQL only

# View last 100 lines
docker-compose -f docker-compose.yml.prod logs --tail=100 cms

# Execute command in container
docker exec cms npm --version
docker exec front ls -la
docker exec postgres psql -U friends -d friends -c "SELECT version();"
```

### Image Management

```bash
# Rebuild images
docker-compose -f docker-compose.yml.prod build

# Rebuild specific service
docker-compose -f docker-compose.yml.prod build --no-cache cms

# View images
docker images

# Remove unused images
docker image prune -a

# View image size
docker images --format "table {{.Repository}}\t{{.Size}}"
```

### System Cleanup

```bash
# Remove all stopped containers
docker container prune

# Remove dangling images
docker image prune

# Remove unused volumes
docker volume prune

# Complete cleanup (containers, images, volumes, networks)
docker system prune -a

# Check disk usage
docker system df
```

## 💾 Database Management

### Backup

```bash
# Create backup
docker exec postgres pg_dump -U friends friends > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup to server directory
docker exec postgres pg_dump -U friends friends > /opt/friendshostel/backups/backup_$(date +%Y%m%d).sql
```

### Restore

```bash
# Restore from backup
docker exec -i postgres psql -U friends friends < backup_20240516.sql

# Note: Database must be empty for full restore
```

### Query Database

```bash
# Connect to PostgreSQL
docker exec -it postgres psql -U friends -d friends

# Inside psql:
\d              # List tables
\l              # List databases
SELECT * FROM information_schema.tables;
```

### Database Info

```bash
# Database size
docker exec postgres psql -U friends -d friends -c "SELECT pg_size_pretty(pg_database_size('friends'));"

# Active connections
docker exec postgres psql -U friends -d friends -c "SELECT usename, application_name, count(*) FROM pg_stat_activity GROUP BY usename, application_name;"

# Database version
docker exec postgres psql -U friends -d friends -c "SELECT version();"
```

## 🌐 Network & DNS

### DNS Testing

```bash
# Check DNS resolution
nslookup domainandpunch.ru
nslookup api.domainandpunch.ru

# More detailed DNS info
dig domainandpunch.ru
dig api.domainandpunch.ru ANY

# Trace DNS resolution
dig +trace domainandpunch.ru
```

### Port Testing

```bash
# Check if ports are open
netstat -tlnp | grep -E ':(80|443|5432)'

# Test connectivity to domain
curl -I https://domainandpunch.ru
curl -I https://api.domainandpunch.ru

# Test with verbose output
curl -v https://domainandpunch.ru

# Check certificate
echo | openssl s_client -servername domainandpunch.ru -connect 186.246.2.35:443 2>/dev/null | openssl x509 -noout -dates
```

## 📊 Monitoring & Performance

### System Resources

```bash
# Real-time container stats
docker stats

# Disk usage
df -h
du -sh /opt/friendshostel/*

# Memory usage
free -h

# CPU usage
top -b -n 1 | head -20
```

### Container Information

```bash
# Detailed container info
docker inspect container_name

# Container resource limits
docker stats --no-stream

# Container network
docker network inspect web

# Container ports
docker port container_name
```

### Log Analysis

```bash
# Count errors in logs
docker-compose -f docker-compose.yml.prod logs cms | grep -i error | wc -l

# Find specific error
docker-compose -f docker-compose.yml.prod logs | grep "ECONNREFUSED"

# Export logs to file
docker-compose -f docker-compose.yml.prod logs > /tmp/docker_logs.txt

# Real-time log following
docker-compose -f docker-compose.yml.prod logs -f --tail=50
```

## 🔄 Deployment & Updates

### Update Application

```bash
# Pull latest code
cd /opt/friendshostel
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.yml.prod build
docker-compose -f docker-compose.yml.prod up -d

# Or all at once
git pull && docker-compose -f docker-compose.yml.prod build --no-cache && docker-compose -f docker-compose.yml.prod up -d
```

### Rollback

```bash
# View git history
git log --oneline

# Checkout previous commit
git checkout <commit-hash>

# Rebuild and restart
docker-compose -f docker-compose.yml.prod build
docker-compose -f docker-compose.yml.prod up -d

# Or go back to main
git checkout main
```

### Manual Deploy Script

```bash
#!/bin/bash
cd /opt/friendshostel
git pull origin main
docker-compose -f docker-compose.yml.prod build --no-cache
docker-compose -f docker-compose.yml.prod up -d
docker-compose -f docker-compose.yml.prod logs -f
```

## 🔐 Security & Maintenance

### File Permissions

```bash
# Fix environment file permissions
chmod 600 cms/.env

# Fix SSL directory permissions
chmod 600 letsencrypt/

# List sensitive files
ls -la cms/.env
ls -la letsencrypt/
```

### Firewall

```bash
# Check firewall status
ufw status

# Allow ports
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# View rules
ufw show added
```

### System Updates

```bash
# Update packages list
apt update

# Update installed packages
apt upgrade

# Install security updates only
apt install unattended-upgrades

# Check for updates
apt list --upgradable
```

## 🐛 Debugging

### Container Shell Access

```bash
# Access container shell
docker exec -it cms bash
docker exec -it front bash
docker exec -it postgres bash

# Run command in container
docker exec cms env
docker exec front pwd
docker exec postgres ls -la
```

### Network Debugging

```bash
# Test DNS inside container
docker exec cms nslookup postgres

# Test connectivity between containers
docker exec cms ping front
docker exec cms curl -I http://postgres:5432

# View network
docker network inspect web
```

### File Inspection

```bash
# View file in container
docker exec cms cat /app/package.json

# Copy file from container
docker cp cms:/app/public/uploads ./local_uploads

# Copy file to container
docker cp ./file.txt cms:/app/file.txt
```

### Environment Variables

```bash
# View container environment
docker exec cms env

# Check specific variable
docker exec cms echo $NODE_ENV
docker exec cms echo $API_URL
```

## 📋 Useful Aliases

Add to `.bashrc` or `.zshrc`:

```bash
# Docker shortcuts
alias dc='docker-compose'
alias dcu='docker-compose -f docker-compose.yml.prod up -d'
alias dcd='docker-compose -f docker-compose.yml.prod down'
alias dcl='docker-compose -f docker-compose.yml.prod logs -f'
alias dcp='docker-compose -f docker-compose.yml.prod ps'
alias dcr='docker-compose -f docker-compose.yml.prod restart'

# Project shortcuts
alias fh='cd /opt/friendshostel'
alias fhlog='docker-compose -f docker-compose.yml.prod logs -f'
alias fhstatus='docker-compose -f docker-compose.yml.prod ps'

# System shortcuts
alias diskspace='df -h | grep -E "^/dev|Filesystem"'
alias ports='netstat -tlnp'
```

## 🆘 Emergency Commands

```bash
# Stop everything
docker-compose -f docker-compose.yml.prod stop

# Force stop everything
docker-compose -f docker-compose.yml.prod kill

# Remove everything and restart
docker-compose -f docker-compose.yml.prod down
docker volume prune -f
docker-compose -f docker-compose.yml.prod up -d

# Check what's using disk space
du -sch /opt/friendshostel/* | sort -rh

# Kill a stuck container
docker kill container_name

# Remove a container
docker rm container_name
```

---

**Tip:** Bookmark this page for quick reference during deployment and maintenance!
