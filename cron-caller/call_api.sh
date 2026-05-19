#!/bin/sh
set -eu

API_TOKEN="${API_TOKEN:?API_TOKEN is required}"
HOST_API_URL="${HOST_API_URL}"

echo "[cron] calling API..."

curl -s -X POST "$HOST_API_URL/api/rooms/sync" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source":"cron"}'

curl -s -X POST "$HOST_API_URL/api/books/check-unpaid" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source":"cron"}'

echo "[cron] done"
