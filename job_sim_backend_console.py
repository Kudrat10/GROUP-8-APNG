# Import statements 
import openai
import os
import numpy as np
import pandas as pd 
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA


# OpenAI API key
openai.api_key = 'YOUR_OPENAI_API_KEY'

# Function to get career advice from OpenAI
def get_future_career_advice(user_background):
    prompt = f"""
    You are an AI-based Future Career Advisor.
    Given the user's background and interests:

    {user_background}

    Provide career guidance structured clearly into three sections:
    1. Safe Careers (low AI replacement risk)
    2. Adaptation Careers (AI-assisted roles)
    3. Risky Careers (high risk of automation)

    Include recommendations for upskilling and transitioning to new roles.
    """

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a future career simulator advisor."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    advice = response.choices[0].message.content
    return advice

# Interactive console input
if __name__ == "__main__":
    print("🚀 Welcome to the Future Career Simulator!\nPlease provide some information to get started.\n")

    name = input("1. Your Name: ")
    education = input("2. Your Education (degrees, fields): ")
    industry_interest = input("3. Industries you're interested in (e.g., Tech, Healthcare): ")
    workstyle = input("4. Your preferred workstyle (Creative, Analytical, Collaborative): ")
    skills = input("5. Your key skills (comma-separated): ")
    personality_type = input("6. Your personality type (e.g., ENFP, INTJ): ")

    user_background = f"""
    Name: {name}
    Education: {education}
    Industry Interests: {industry_interest}
    Preferred Workstyle: {workstyle}
    Skills: {skills}
    """

    print("\nGenerating your personalised future career advice...\n")

    career_advice = get_future_career_advice(user_background)

    print("🎯 **Your Future Career Advice:**\n")
    print(career_advice)