#!/bin/bash

################################################################################
# SSL Certificate Setup Script
# Manually trigger SSL certificate generation if needed
# Usage: bash setup-ssl.sh
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== SSL Certificate Setup ===${NC}"

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}"
   exit 1
fi

PROJECT_DIR="/opt/friendshostel"

if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Project directory not found: $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

# Check if containers are running
echo -e "${YELLOW}Checking if containers are running...${NC}"
if ! docker ps | grep -q "traefik"; then
    echo -e "${YELLOW}Starting Docker containers...${NC}"
    docker-compose -f docker-compose.yml.prod up -d
    sleep 10
fi

# Wait for DNS propagation
echo -e "${YELLOW}Waiting 30 seconds for DNS resolution...${NC}"
sleep 30

# Make requests to trigger certificate generation
echo -e "${GREEN}Triggering certificate generation...${NC}"

DOMAINS=("domainandpunch.ru" "api.domainandpunch.ru")

for domain in "${DOMAINS[@]}"; do
    echo -e "${YELLOW}Requesting https://$domain${NC}"
    curl -I --insecure "https://$domain" 2>/dev/null || echo "First request (certificate generation in progress)"
done

# Wait for certificate generation
echo -e "${YELLOW}Waiting for certificate generation (60 seconds)...${NC}"
sleep 60

# Verify certificates
echo -e "${GREEN}Verifying certificates...${NC}"

if [ -f "$PROJECT_DIR/letsencrypt/acme.json" ]; then
    docker exec traefik cat /letsencrypt/acme.json | jq '.Certificates[]?.Domain' 2>/dev/null || echo "Could not verify certificates"
    echo -e "${GREEN}✓ acme.json found${NC}"
else
    echo -e "${RED}✗ acme.json not found${NC}"
    exit 1
fi

# Check certificate validity
echo -e "${GREEN}Checking certificate validity in 5 seconds...${NC}"
sleep 5

for domain in "${DOMAINS[@]}"; do
    echo -e "${YELLOW}Testing https://$domain${NC}"
    response=$(curl -s -o /dev/null -w "%{http_code}" --insecure "https://$domain")
    if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
        echo -e "${GREEN}✓ $domain responding (HTTP $response)${NC}"
    else
        echo -e "${RED}✗ $domain not responding properly (HTTP $response)${NC}"
    fi
done

echo ""
echo -e "${GREEN}=== SSL Setup Complete ===${NC}"
echo ""
echo -e "${YELLOW}Certificate location:${NC} /letsencrypt/acme.json"
echo -e "${YELLOW}Traefik logs:${NC} docker-compose -f docker-compose.yml.prod logs traefik"
echo ""
