from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from nlp import analyze_text

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LeakCheckRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None

@app.post("/check")
async def check_leak(data: LeakCheckRequest):
    breaches = []

    # ✅ Mock breach check for demo
    if data.email and "gmail.com" in data.email:
        breaches.append({
            "Name": "MockBreachSite",
            "Description": "Email and passwords leaked in 2021."
        })

    # ✅ NLP entity detection
    nlp_entities = analyze_text(f"{data.email or ''} {data.phone or ''}")

    # ✅ Risk calculation
    if breaches:
        risk = "High"
    elif nlp_entities:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "breaches": breaches,
        "nlp_entities": nlp_entities,
        "risk": risk
    }
