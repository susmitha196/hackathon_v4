# 🏭 Factory Copilot - Hackathon MVP

A real-time machine health monitoring system that predicts downtime risk using ML and explains it using AI.

## 📁 Project Structure

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
└── requirements.txt       # Python dependencies
```

## 🚀 Quick Start

See [docs/QUICKSTART.md](docs/QUICKSTART.md) for detailed instructions.

### Basic Setup

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the app**:
   ```bash
   # Option 1: Using convenience script (recommended)
   python run_app.py
   
   # Option 2: Direct execution
   streamlit run src/app.py
   ```

3. **Access the dashboard**:
   - Open http://localhost:8501 in your browser

## 📚 Documentation

- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in 5 minutes
- **[Deployment Guide](docs/DEPLOY.md)** - Deploy to Google Cloud
- **[n8n Setup](docs/N8N_SETUP.md)** - Configure automation
- **[Email Alerts](docs/N8N_EMAIL_SETUP.md)** - Set up email notifications
- **[Project Plan](docs/plan.md)** - Development roadmap

## 🎯 Features

✅ Real-time IoT 4.0 sensor data generation  
✅ ML-based downtime prediction  
✅ AI-powered root cause analysis (OpenAI)  
✅ Trend analysis with Gemini  
✅ Automated workflow triggers (n8n)  
✅ Switch between live data and JSON file  
✅ Clean, intuitive UI  

## 🛠️ Tech Stack

- **Frontend**: Streamlit
- **Backend**: FastAPI (optional)
- **ML**: scikit-learn (RandomForest)
- **AI**: OpenAI (GPT-3.5), Google Gemini
- **Automation**: n8n webhooks
- **Visualization**: Plotly

## 📝 License

Hackathon project - open for use and modification.

---

**Built for Hackathon** | Optimized for speed and stability | MVP-ready demo
