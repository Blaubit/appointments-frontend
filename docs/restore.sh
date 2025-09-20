#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup_file.sql.gz>"
    echo "Available backups:"
    ls -la ./backups/*.sql.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    exit 1
fi

echo "⚠️  WARNING: This will replace all data in the database!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restore cancelled"
    exit 1
fi

# Load environment variables
if [ -f ".env" ]; then
    export $(cat .env | xargs)
fi

echo "📂 Restoring database from: $BACKUP_FILE"

# Extract if compressed
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | docker-compose exec -T database psql -U ${DB_USER:-alex} -d ${DB_NAME:-appointments_db}
else
    cat $BACKUP_FILE | docker-compose exec -T database psql -U ${DB_USER:-alex} -d ${DB_NAME:-appointments_db}
fi

if [ $? -eq 0 ]; then
    echo "✅ Database restored successfully!"
else
    echo "❌ Restore failed!"
    exit 1
fi