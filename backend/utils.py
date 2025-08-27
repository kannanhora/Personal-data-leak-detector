def risk_score(breaches, password_leak: bool, phone: str | None):
    """
    Compute risk level based on breaches, password leaks, and phone presence.
    """
    if password_leak:
        return "High"
    if breaches and phone:
        return "Medium"
    if breaches:
        return "Low"
    return "Safe"
