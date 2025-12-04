#!/bin/bash
# Start backend with Redis enabled (REDIS_HOST must be set for RedisPublisher to connect)
cd "$(dirname "$0")"
export REDIS_HOST=127.0.0.1
export REDIS_PORT=6380
npm run start:dev
