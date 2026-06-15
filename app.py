from flask import Flask, render_template, request, jsonify
import os
from dotenv import load_dotenv
# import openai  # Uncomment if using OpenAI

load_dotenv() # Load your API keys securely

app = Flask(__name__)

# Simulated AI processing logic for demonstration
def generate_ai_response(function_type, prompt_content):
    # In production, replace this with your actual API calls:
    # response = openai.ChatCompletion.create(...)
    if function_type == "1":
        return f"Factual Answer to '{prompt_content}': Paris is the capital of France."
    elif function_type == "2":
        return f"Summary: This text outlines key aspects of '{prompt_content[:30]}...'."
    elif function_type == "3":
        return f"Creative Content: Deep in the digital universe, '{prompt_content}' came alive..."
    return "Invalid selection."

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    func_type = data.get('type')
    user_input = data.get('message')
    
    if not func_type or not user_input:
        return jsonify({"error": "Missing parameters"}), 400
        
    ai_output = generate_ai_response(func_type, user_input)
    return jsonify({"response": ai_output})

@app.route('/api/feedback', methods=['POST'])
def feedback():
    data = request.json
    # Log feedback to a file or database
    with open("feedback.log", "a") as f:
        f.write(f"Rating: {data.get('status')} for context.\n")
    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True)
