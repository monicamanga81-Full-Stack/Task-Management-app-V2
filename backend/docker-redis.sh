#!/bin/bash
# Quick script to run Redis locally via docker-compose from project root
# Usage: ./docker-redis.sh

cd "$(dirname "$0")/.."
docker-compose up -d redis
echo "Redis started on port 6380"
docker-compose ps
