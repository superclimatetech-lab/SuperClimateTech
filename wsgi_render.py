"""
Render WSGI Application Entry Point
This module configures and exports the WSGI application for deployment on Render.com
"""

import os
import sys
import django
from pathlib import Path

# Get the project root directory
BASE_DIR = Path(__file__).resolve().parent

# Add backend directory to Python path so Django can find modules
BACKEND_DIR = BASE_DIR / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Set Django settings module - use environment variable if set, otherwise default
os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    os.environ.get('DJANGO_SETTINGS_MODULE', 'supertech_backend.settings')
)

# Configure Django
django.setup()

# Import the WSGI application
try:
    from supertech_backend.wsgi import application
except ImportError as e:
    print(f"ERROR: Failed to import WSGI application: {e}")
    print(f"BASE_DIR: {BASE_DIR}")
    print(f"BACKEND_DIR: {BACKEND_DIR}")
    print(f"sys.path: {sys.path}")
    raise

# Export as 'app' for Render compatibility
app = application

# Export both for compatibility
__all__ = ['app', 'application']
