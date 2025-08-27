import requests

# Mock HIBP API URL (replace with actual API if you get key)
HIBP_URL = "https://haveibeenpwned.com/api/v3/breachedaccount/{}"

def check_email_breaches(email: str):
    """
    Check for breaches related to an email.
    Currently mocked for demo (replace with real HIBP API call later).
    Returns a list of breach dicts.
    """
    # Example mock breaches
    breaches = [
        {"Name": "MockBreachSite", "Description": "Email and passwords leaked in 2021."}
    ] if email and "@" in email else []
    
    return breaches

def check_password_leak(password: str):
    """
    Check if password is leaked using HaveIBeenPwned PwnedPasswords API.
    For demo, returns True if password is '123456' or 'password'.
    """
    leaked_passwords = ["123456", "password", "qwerty"]
    return password in leaked_passwords
