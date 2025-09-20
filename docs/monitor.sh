#!/bin/bash

INTERVAL=${1:-30}  # Default 30 seconds

echo "📊 Starting continuous monitoring (interval: ${INTERVAL}s)"
echo "Press Ctrl+C to stop"
echo "======================================================="

while true; do
    clear
    echo "🕐 $(date)"
    echo "======================================================="
    
    # Quick health check
    ./health-check.sh
    
    echo -e "\n⏰ Next check in ${INTERVAL} seconds..."
    sleep $INTERVAL
done