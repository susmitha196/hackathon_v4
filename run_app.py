"""
Convenience script to run the Streamlit app from project root
"""
import sys
import os
import subprocess

if __name__ == "__main__":
    # Get the directory where this script is located (project root)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    app_path = os.path.join(script_dir, 'src', 'app.py')
    
    # Verify app.py exists
    if not os.path.exists(app_path):
        print(f"Error: Could not find app.py at {app_path}")
        sys.exit(1)
    
    # Run streamlit from project root, pointing to src/app.py
    subprocess.run([sys.executable, "-m", "streamlit", "run", "src/app.py"] + sys.argv[1:])
