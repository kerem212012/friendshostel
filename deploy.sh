#!/bin/bash

################################################################################
# Friendshostel Deployment Script
# Deploy to production server
# Usage: bash deploy.sh
################################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="domainandpunch.ru"
API_DOMAIN="api.domainandpunch.ru"
EMAIL="maksfedorov@gmail.com"
PROJECT_DIR="/opt/friendshostel"

echo -e "${GREEN}=== Friendshostel Deployment Script ===${NC}"
echo -e "${YELLOW}Domain: $DOMAIN${NC}"
echo -e "${YELLOW}API Domain: $API_DOMAIN${NC}"

# Step 1: Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

# Step 2: Update system packages
echo -e "${GREEN}[1/8] Updating system packages...${NC}"
apt-get update
apt-get upgrade -y

# Step 3: Install Docker
echo -e "${GREEN}[2/8] Installing Docker and Docker Compose...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    bash get-docker.sh
    rm get-docker.sh
fi

if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Step 4: Install Git
echo -e "${GREEN}[3/8] Installing Git...${NC}"
apt-get install -y git

# Step 5: Clone or pull repository
echo -e "${GREEN}[4/8] Setting up project directory...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    cd "$PROJECT_DIR"
    git pull origin main || git pull origin master
else
    mkdir -p /opt
    cd /opt
    git clone https://github.com/yourusername/friendshostel.git friendshostel
    cd "$PROJECT_DIR"
fi

# Step 6: Setup environment files
echo -e "${GREEN}[5/8] Setting up environment files...${NC}"
if [ ! -f "$PROJECT_DIR/cms/.env" ]; then
    echo -e "${YELLOW}Creating cms/.env from template...${NC}"
    cp "$PROJECT_DIR/cms/.env.example" "$PROJECT_DIR/cms/.env" 2>/dev/null || \
    cat > "$PROJECT_DIR/cms/.env" << 'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=changeme1,changeme2,changeme3,changeme4
API_TOKEN_SALT=changeme
ADMIN_JWT_SECRET=changeme
TRANSFER_TOKEN_SALT=changeme
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=friends
DATABASE_USER=friends
DATABASE_PASSWORD=friends
JWT_SECRET=changeme
EOF
    chmod 600 "$PROJECT_DIR/cms/.env"
fi

# Step 7: Create SSL directory with proper permissions
echo -e "${GREEN}[6/8] Setting up SSL directory...${NC}"
mkdir -p "$PROJECT_DIR/letsencrypt"
chmod 600 "$PROJECT_DIR/letsencrypt"

# Step 8: Start Docker containers
echo -e "${GREEN}[7/8] Starting Docker containers...${NC}"
cd "$PROJECT_DIR"
docker-compose -f docker-compose.yml.prod up -d

# Step 9: Verify deployment
echo -e "${GREEN}[8/8] Verifying deployment...${NC}"
sleep 10

if docker ps | grep -q "traefik"; then
    echo -e "${GREEN}✓ Traefik is running${NC}"
else
    echo -e "${RED}✗ Traefik failed to start${NC}"
    exit 1
fi

if docker ps | grep -q "cms"; then
    echo -e "${GREEN}✓ CMS service is running${NC}"
else
    echo -e "${RED}✗ CMS service failed to start${NC}"
    exit 1
fi

if docker ps | grep -q "front"; then
    echo -e "${GREEN}✓ Front service is running${NC}"
else
    echo -e "${RED}✗ Front service failed to start${NC}"
    exit 1
fi

if docker ps | grep -q "postgres"; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo -e "${RED}✗ PostgreSQL failed to start${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update DNS records to point to this server's IP address:"
echo "   - $DOMAIN A 186.246.2.35"
echo "   - $API_DOMAIN A 186.246.2.35"
echo ""
echo "2. Wait for DNS propagation (up to 48 hours)"
echo ""
echo "3. Verify services:"
echo "   - Frontend: https://$DOMAIN"
echo "   - API/CMS: https://$API_DOMAIN"
echo "   - Traefik Dashboard: http://localhost:8085 (local only)"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo "  docker-compose -f docker-compose.yml.prod logs -f"
echo ""
echo -e "${YELLOW}Status:${NC}"
echo "  docker-compose -f docker-compose.yml.prod ps"
echo ""
