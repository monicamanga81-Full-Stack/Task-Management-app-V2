@echo off
REM Start backend with Redis enabled (REDIS_HOST must be set for RedisPublisher to connect)
cd /d "%~dp0"
set REDIS_HOST=127.0.0.1
set REDIS_PORT=6380
npm run start:dev
