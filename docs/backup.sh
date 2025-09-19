#!/bin/bash

BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/appointments_db_$DATE.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "📁 Creating database backup..."

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | xargs)
fi

# Create backup
docker-compose exec -T database pg_dump -U ${DB_USER:-alex} -d ${DB_NAME:-appointments_db} > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully: $BACKUP_FILE"
    
    # Compress the backup
    gzip $BACKUP_FILE
    echo "🗜️  Backup compressed: $BACKUP_FILE.gz"
    
    # Keep only last 7 backups
    cd $BACKUP_DIR
    ls -t *.sql.gz | tail -n +8 | xargs rm -f
    echo "🧹 Old backups cleaned up (keeping last 7)"
    
else
    echo "❌ Backup failed!"
    exit 1
fi