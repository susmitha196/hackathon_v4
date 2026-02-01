"""
Convenience script to run the FastAPI backend from project root
"""
import sys
import os

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Add src directory to path
    src_path = os.path.join(script_dir, 'src')
    sys.path.insert(0, src_path)
    
    try:
        from api import app
        import uvicorn
        # Use PORT environment variable if available (for Railway/Render/etc), otherwise default to 8000
        import os
        port = int(os.getenv("PORT", 8000))
        uvicorn.run(app, host="0.0.0.0", port=port)
    except ImportError as e:
        print(f"Error importing api: {e}")
        print(f"Make sure api.py exists in {src_path}")
        sys.exit(1)
