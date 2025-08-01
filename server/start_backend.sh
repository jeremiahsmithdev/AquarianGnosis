#!/bin/bash

# This script should be run from the 'server' directory as specified in ecosystem.config.js

# Activate virtual environment
if [[ -f "./venv/bin/activate" ]]; then
    source "./venv/bin/activate"
else
    echo "Error: Virtual environment not found at ./venv"
    exit 1
fi

# Start the backend server
python run.py