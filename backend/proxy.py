# /backend/proxy.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    messages = data.get("messages", [])
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages
    )
    return jsonify(response["choices"][0]["message"])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
