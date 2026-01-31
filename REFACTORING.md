# 📁 Project Refactoring Summary

The project has been reorganized into a cleaner folder structure.

## New Structure

```
hackathon/
├── src/                    # Main application code
│   ├── app.py             # Streamlit UI dashboard
│   ├── api.py             # FastAPI backend
│   ├── ml_model.py        # ML prediction model
│   ├── ai_explainer.py    # OpenAI explanations
│   ├── gemini_analyzer.py # Gemini trend analysis
│   └── automation.py      # n8n automation
├── data/                   # Data files
│   └── sample_sensor_data.json
├── docs/                   # Documentation
│   ├── README.md          # Full documentation
│   ├── QUICKSTART.md      # Quick start guide
│   ├── DEPLOY.md          # Deployment guide
│   ├── plan.md            # Project plan
│   ├── N8N_SETUP.md      # n8n setup guide
│   └── N8N_EMAIL_SETUP.md # Email alerts setup
├── scripts/                # Utility scripts
│   ├── test_n8n_webhook.py
│   └── create_email_workflow.py
├── deploy/                 # Deployment files
│   ├── Dockerfile
│   ├── cloudbuild.yaml
│   ├── app.yaml
│   ├── deploy.sh
│   └── deploy.bat
├── workflows/             # n8n workflow files
│   └── n8n_email_workflow.json
├── run_app.py             # Convenience script to run app
├── run_api.py             # Convenience script to run API
├── requirements.txt       # Python dependencies
└── README.md              # Main README
```

## How to Run

### Option 1: Using convenience scripts (from project root)
```bash
# Run Streamlit app
python run_app.py

# Run FastAPI backend
python run_api.py
```

### Option 2: Direct execution
```bash
# Run Streamlit app
streamlit run src/app.py

# Run FastAPI backend
cd src && python api.py
```

## Changes Made

1. ✅ Created folder structure (src, data, docs, scripts, deploy, workflows)
2. ✅ Moved source files to `src/` (app.py, api.py, ml_model.py, ai_explainer.py, gemini_analyzer.py, automation.py)
3. ✅ Moved data files to `data/` (sample_sensor_data.json)
4. ✅ Moved documentation to `docs/` (all .md files except README.md)
5. ✅ Moved scripts to `scripts/` (test_n8n_webhook.py, create_email_workflow.py)
6. ✅ Moved deployment files to `deploy/` (Dockerfile, cloudbuild.yaml, app.yaml, deploy.sh, deploy.bat)
7. ✅ Moved workflow files to `workflows/` (n8n_email_workflow.json)
8. ✅ Updated imports in app.py and api.py (with fallback for compatibility)
9. ✅ Updated JSON file path resolution to work from src/ directory
10. ✅ Updated convenience scripts (run_app.py, run_api.py) to work with new structure
11. ✅ Created src/__init__.py for package structure
12. ✅ Updated README.md with correct run instructions
13. ✅ Created .gitignore file

## Notes

- Imports use try/except to support both relative and absolute imports
- JSON file path resolution checks multiple locations (project root, relative paths)
- Convenience scripts handle path setup automatically
- Documentation is now organized in `docs/` folder
- All source code is in `src/` folder for clean separation
