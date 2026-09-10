#!/usr/bin/env bash
# run_migrations.sh
# Run all PostgreSQL migrations in order.
# Usage: bash run_migrations.sh [DB_HOST] [DB_PORT] [DB_NAME] [DB_USER]

DB_HOST=${1:-localhost}
DB_PORT=${2:-5432}
DB_NAME=${3:-interviewexplainer}
DB_USER=${4:-interviewexplainer}

MIGRATIONS_DIR="$(dirname "$0")/migrations"

echo "============================================"
echo "  InterviewExplainer DB Migration Runner"
echo "  Host: $DB_HOST:$DB_PORT  DB: $DB_NAME"
echo "============================================"

for file in "$MIGRATIONS_DIR"/*.sql; do
    filename=$(basename "$file")
    echo "→ Running: $filename"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
    if [ $? -ne 0 ]; then
        echo "  ✗ FAILED: $filename — stopping."
        exit 1
    fi
    echo "  ✓ Done: $filename"
done

echo ""
echo "✅ All migrations completed successfully."
