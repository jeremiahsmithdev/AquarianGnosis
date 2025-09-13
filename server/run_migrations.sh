#!/bin/bash

# Run database migrations
echo "Running database migrations..."

# Check if alembic is installed
if ! command -v alembic &> /dev/null
then
    echo "Alembic not found. Installing..."
    pip install alembic
fi

# Run migrations
alembic upgrade head

echo "Database migrations completed successfully."
