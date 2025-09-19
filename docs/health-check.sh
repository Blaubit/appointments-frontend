#!/bin/bash

echo "🏥 Comprehensive Health Check"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check service health
check_service() {
    local service=$1
    local url=$2
    local timeout=${3:-10}
    
    echo -n "Checking $service... "
    
    if curl -f -s --max-time $timeout $url > /dev/null; then
        echo -e "${GREEN}✅ Healthy${NC}"
        return 0
    else
        echo -e "${RED}❌ Unhealthy${NC}"
        return 1
    fi
}

# Function to check database connection
check_database() {
    echo -n "Checking database connection... "
    
    if docker-compose exec -T database pg_isready -U ${DB_USER:-alex} -d ${DB_NAME:-appointments_db} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Connected${NC}"
        return 0
    else
        echo -e "${RED}❌ Connection failed${NC}"
        return 1
    fi
}

# Function to check container status
check_containers() {
    echo -e "\n📦 Container Status:"
    echo "==================="
    
    containers=$(docker-compose ps --services)
    all_healthy=true
    
    for container in $containers; do
        status=$(docker-compose ps -q $container | xargs docker inspect --format='{{.State.Status}}' 2>/dev/null)
        health=$(docker-compose ps -q $container | xargs docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no-health-check{{end}}' 2>/dev/null)
        
        echo -n "$container: "
        
        if [ "$status" = "running" ]; then
            if [ "$health" = "healthy" ]; then
                echo -e "${GREEN}✅ Running & Healthy${NC}"
            elif [ "$health" = "no-health-check" ]; then
                echo -e "${YELLOW}⚠️  Running (no health check)${NC}"
            else
                echo -e "${RED}❌ Running but unhealthy ($health)${NC}"
                all_healthy=false
            fi
        else
            echo -e "${RED}❌ Not running ($status)${NC}"
            all_healthy=false
        fi
    done
    
    return $all_healthy
}

# Function to check resource usage
check_resources() {
    echo -e "\n💻 Resource Usage:"
    echo "=================="
    
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" | head -10
}

# Function to check logs for errors
check_logs() {
    echo -e "\n📋 Recent Error Logs:"
    echo "===================="
    
    # Check for errors in the last 50 lines
    error_count=0
    
    for service in backend frontend database; do
        errors=$(docker-compose logs --tail=50 $service 2>/dev/null | grep -i error | wc -l)
        if [ $errors -gt 0 ]; then
            echo -e "${RED}❌ $service: $errors errors found${NC}"
            docker-compose logs --tail=5 $service | grep -i error
            error_count=$((error_count + errors))
        else
            echo -e "${GREEN}✅ $service: No recent errors${NC}"
        fi
    done
    
    return $error_count
}

# Main health check execution
main() {
    local exit_code=0
    
    # Load environment if available
    if [ -f ".env" ]; then
        export $(cat .env | xargs)
    fi
    
    # Check containers first
    if ! check_containers; then
        exit_code=1
    fi
    
    # Check individual services
    echo -e "\n🌐 Service Health Checks:"
    echo "========================"
    
    if ! check_service "Database" "http://localhost:${DB_PORT:-5432}" 5; then
        exit_code=1
    fi
    
    if ! check_database; then
        exit_code=1
    fi
    
    if ! check_service "Backend API" "http://localhost:${BACKEND_PORT:-3000}/health" 10; then
        exit_code=1
    fi
    
    if ! check_service "Frontend" "http://localhost:${FRONTEND_PORT:-3001}" 10; then
        exit_code=1
    fi
    
    # Check resources
    check_resources
    
    # Check for errors
    if ! check_logs; then
        exit_code=1
    fi
    
    # Final status
    echo -e "\n🎯 Overall Status:"
    echo "================="
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ All systems healthy!${NC}"
    else
        echo -e "${RED}❌ Some issues detected. Check the output above.${NC}"
    fi
    
    return $exit_code
}

# Run main function
main "$@"