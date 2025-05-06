from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    messages = data.get("messages", [])
    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages
        )
        return jsonify(response.choices[0].message.model_dump())
    except Exception as e:
        print("❌ OpenAI API error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("✅ Flask server starting...")
    app.run(debug=True, port=5000)
import sys
print("🧪 Python running from:", sys.executable)
