import os
import sys

# Add the parent directory to sys.path so we can import the backend package
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app

# Vercel needs the app object to be named 'app'
# Since we import it as 'app', it should be fine.
