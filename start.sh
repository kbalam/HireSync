#!/bin/bash
echo "Installing dependencies..."
pip install -r backend/requirements.txt  # Point to requirements.txt in backend folder
echo "Dependencies installed successfully."
echo "Starting Flask app..."
cd /opt/render/project/src/
python backend/app.py