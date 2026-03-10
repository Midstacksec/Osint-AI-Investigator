def generate_report(email: str, data: dict, risk: int) -> str:
    report = f"""
OSINT Investigation Report

Target: {email}

Risk Score: {risk}/10

Findings:

Breaches detected: {data['breaches']}
Gravatar profile found: {data['gravatar']}
GitHub account found: {data['github']}

Recommendation:

If exposure is confirmed, change passwords and enable MFA.
"""
    return report
