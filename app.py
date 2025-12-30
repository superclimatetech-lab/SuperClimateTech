"""
Render deployment configuration for SuperTech Backend
This file serves as the entry point for Gunicorn on Render
"""

import os
import sys
from pathlib import Path

# Add backend directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'supertech_backend.settings')

# Import and configure Django
import django
django.setup()

# Import the WSGI application
from supertech_backend.wsgi import application

# For Render compatibility
app = application

__all__ = ['app', 'application']
