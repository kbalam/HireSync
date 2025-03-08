import os
import sys

# Add the backend directory to the path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.app import app

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000)