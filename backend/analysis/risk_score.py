def calculate_risk(data: dict) -> int:
    score = 0

    if data["breaches"] > 0:
        score += 4
    if data["gravatar"]:
        score += 2
    if data["github"]:
        score += 2

    if score > 10:
        score = 10

    return score
