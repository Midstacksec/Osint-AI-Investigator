from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from osint.email_lookup import investigate_email
from analysis.risk_score import calculate_risk
from ai.report_generator import generate_report

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/investigate")
def investigate(email: str):
    
    return {
        "target": email,
        "risk_score": 5,
        "data": {
            "breaches": 1,
            "gravatar": False,
            "github": False,
        },
        "report": "Relatório de teste: backend respondeu OK."
    }
