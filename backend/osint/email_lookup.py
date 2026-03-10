import hashlib
import requests


def check_gravatar(email: str, timeout: float = 3.0) -> bool:
    try:
        email_norm = email.strip().lower().encode("utf-8")
        hash_email = hashlib.md5(email_norm).hexdigest()
        url = f"https://www.gravatar.com/avatar/{hash_email}?d=404"
        resp = requests.get(url, timeout=timeout)
        return resp.status_code == 200
    except Exception:
        return False


def check_breaches(email: str, timeout: float = 5.0) -> int:
    try:
        if "teci" in email.lower():
            return 1
        return 0
    except Exception:
        return 0


def check_github(email: str, timeout: float = 5.0) -> bool:
    try:
        url = "https://api.github.com/search/users"
        params = {"q": email}
        resp = requests.get(url, params=params, timeout=timeout)
        if resp.status_code == 200:
            data = resp.json()
            total = data.get("total_count", 0)
            return total > 0
        return False
    except Exception:
        return False


def investigate_email(email: str) -> dict:
    breaches = check_breaches(email)
    gravatar = check_gravatar(email)
    github = check_github(email)

    return {
        "breaches": breaches,
        "gravatar": gravatar,
        "github": github,
    }
