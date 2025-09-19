#!/bin/bash

set -e

echo "🚀 Appointments App Deployment Script"
echo "====================================="

# Check if environment is specified
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh [development|production]"
    exit 1
fi

ENV=$1
echo "🔧 Deploying in $ENV environment..."

# Load environment variables
if [ -f ".env.$ENV" ]; then
    export $(cat .env.$ENV | xargs)
    echo "✅ Loaded .env.$ENV"
else
    echo "❌ .env.$ENV file not found!"
    exit 1
fi

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to build and deploy
deploy() {
    local env=$1
    
    echo "🏗️  Building containers for $env..."
    
    if [ "$env" = "production" ]; then
        # Production deployment with nginx
        docker-compose --env-file .env.$env -f docker-compose.yml --profile production down -v
        docker-compose --env-file .env.$env -f docker-compose.yml --profile production build --no-cache
        docker-compose --env-file .env.$env -f docker-compose.yml --profile production up -d
        
        echo "🌐 Production deployment complete!"
        echo "📊 Access your app at: http://localhost (HTTP) or https://localhost (HTTPS)"
        
    else
        # Development deployment
        docker-compose --env-file .env.$env down -v
        docker-compose --env-file .env.$env build
        docker-compose --env-file .env.$env up -d
        
        echo "🔧 Development deployment complete!"
        echo "🖥️  Frontend: http://localhost:${FRONTEND_PORT:-3001}"
        echo "🔌 Backend API: http://localhost:${BACKEND_PORT:-3000}"
        echo "🗄️  Database: localhost:${DB_PORT:-5432}"
    fi
}

# Function to show logs
show_logs() {
    echo "📋 Showing container logs..."
    docker-compose --env-file .env.$ENV logs -f --tail=100
}

# Function to check health
check_health() {
    echo "🏥 Checking container health..."
    docker-compose --env-file .env.$ENV ps
    
    echo ""
    echo "🔍 Health check details:"
    docker inspect --format='{{.Name}}: {{.State.Health.Status}}' $(docker-compose --env-file .env.$ENV ps -q) 2>/dev/null || echo "No health checks configured"
}

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    docker-compose --env-file .env.$ENV down -v --remove-orphans
    docker system prune -f
    echo "✅ Cleanup complete"
}

# Main execution
check_docker

case "$ENV" in
    "development"|"dev")
        deploy "development"
        ;;
    "production"|"prod")
        deploy "production"
        ;;
    "logs")
        show_logs
        ;;
    "health"|"status")
        check_health
        ;;
    "cleanup"|"clean")
        cleanup
        ;;
    *)
        echo "❌ Invalid environment: $ENV"
        echo "Usage: ./deploy.sh [development|production|logs|health|cleanup]"
        exit 1
        ;;
esac

echo ""
echo "🎉 Script completed successfully!"