#!/bin/bash

echo "🔄 Updating Appointments Application"
echo "==================================="

# Pull latest changes (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes..."
    git pull origin main
fi

# Backup database before update
echo "💾 Creating pre-update backup..."
./backup.sh

# Update dependencies
echo "📦 Updating dependencies..."

# Backend dependencies
cd appointments-backend
npm update
cd ..

# Frontend dependencies
cd appointments-frontend
pnpm update
cd ..

# Rebuild and restart containers
echo "🏗️  Rebuilding containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Run health check
echo "🏥 Running post-update health check..."
./health-check.sh

echo "✅ Update completed!"