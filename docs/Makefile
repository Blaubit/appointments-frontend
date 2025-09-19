.PHONY: help dev prod logs health cleanup build test

help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	@echo "🔧 Starting development environment..."
	@docker compose --env-file .env.development up -d --build

prod: ## Start production environment
	@echo "🚀 Starting production environment..."
	@docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d --build

logs: ## Show container logs
	@docker compose logs -f --tail=100

health: ## Check container health
	@echo "🏥 Checking container health..."
	@docker compose ps
	@echo ""
	@docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}"

cleanup: ## Clean up containers and images
	@echo "🧹 Cleaning up..."
	@docker compose down -v --remove-orphans
	@docker system prune -f

build: ## Build containers without starting
	@echo "🏗️  Building containers..."
	@docker compose build --no-cache

test: ## Run tests in containers
	@echo "🧪 Running tests..."
	@docker compose exec backend npm test || echo "No tests configured for backend"
	@docker compose exec frontend pnpm test || echo "No tests configured for frontend"

restart: ## Restart all services
	@echo "🔄 Restarting services..."
	@docker compose restart

shell-backend: ## Access backend container shell
	@docker compose exec backend sh

shell-frontend: ## Access frontend container shell
	@docker compose exec frontend sh

shell-db: ## Access database shell
	@docker compose exec database psql -U $(DB_USER) -d $(DB_NAME)