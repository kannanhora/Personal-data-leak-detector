from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserData(BaseModel):
    email: str | None = None
    phone: str | None = None
    site: str | None = None

mock_breaches = [
    {"Name": "ExampleSite", "Description": "Email leaked in 2022."},
    {"Name": "MockBreachSite", "Description": "Email leaked in 2021."},
    {"Name": "DemoSite", "Description": "Phone number leaked in 2020."}
]

def check_email_breaches(email: str | None, site: str | None):
    if not email:
        return []
    if site:
        return [b for b in mock_breaches if site.lower() in b["Name"].lower()]
    return mock_breaches

def analyze_text(text: str):
    entities = []
    if "@" in text:
        entities.append({"entity": "Email", "label": "EMAIL"})
    if any(char.isdigit() for char in text):
        entities.append({"entity": "Phone Number", "label": "CARDINAL"})
    return entities

def calculate_risk(breaches):
    if len(breaches) > 1:
        return "High"
    elif len(breaches) == 1:
        return "Medium"
    return "Low"

@app.post("/check")
def check_data(user: UserData):
    breaches = check_email_breaches(user.email, user.site)
    nlp_entities = analyze_text(f"{user.email or ''} {user.phone or ''}")
    risk = calculate_risk(breaches)

    return {
        "breaches": breaches,
        "nlp_entities": nlp_entities,
        "risk": risk
    }
