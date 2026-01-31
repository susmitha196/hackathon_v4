# 📁 Factory Copilot - Project Structure

## Current Organization

The project has been refactored into a cleaner folder structure:

```
hackathon/
├── src/                    # Main application code (if organized)
│   └── (source files)
├── data/                   # Data files
│   └── sample_sensor_data.json
├── docs/                   # Documentation
│   ├── README.md
│   ├── QUICKSTART.md
│   ├── DEPLOY.md
│   ├── plan.md
│   ├── N8N_SETUP.md
│   └── N8N_EMAIL_SETUP.md
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
├── app.py                  # Streamlit UI (main entry point)
├── api.py                  # FastAPI backend
├── ml_model.py            # ML prediction model
├── ai_explainer.py        # OpenAI explanations
├── gemini_analyzer.py     # Gemini trend analysis
├── automation.py          # n8n automation
├── run_app.py             # Convenience script to run app
├── run_api.py             # Convenience script to run API
├── requirements.txt       # Python dependencies
└── README.md              # Main README
```

## How to Run

### Run Streamlit App
```bash
streamlit run app.py
```

Or use the convenience script:
```bash
python run_app.py
```

### Run FastAPI Backend
```bash
python api.py
```

Or use the convenience script:
```bash
python run_api.py
```

## File Locations

- **Main app**: `app.py` (root)
- **API**: `api.py` (root)
- **ML Model**: `ml_model.py` (root)
- **AI Components**: `ai_explainer.py`, `gemini_analyzer.py`, `automation.py` (root)
- **Data**: `data/sample_sensor_data.json`
- **Documentation**: `docs/` folder
- **Scripts**: `scripts/` folder
- **Deployment**: `deploy/` folder
- **Workflows**: `workflows/` folder

## Notes

- Source files are currently in the root directory for easy access
- Data files are organized in `data/` folder
- Documentation is organized in `docs/` folder
- Scripts are in `scripts/` folder
- Deployment files are in `deploy/` folder
- The app automatically finds `sample_sensor_data.json` in the `data/` folder
