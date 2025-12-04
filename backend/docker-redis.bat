@echo off
REM Quick script to run Redis locally via docker-compose from project root
REM Usage: docker-redis.bat

cd /d "%~dp0.."
docker-compose up -d redis
echo Redis started on port 6380
docker-compose ps
