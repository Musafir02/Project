from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

# === AI SETTINGS ===
OPENROUTER_API_KEY = "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"
OPENROUTER_MODEL = "deepseek-chat"

# === HOME PAGE ===
@app.route("/")
def home():
    return render_template("index.html")

# === AI CHATBOT ENDPOINT ===
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5000",  # 🔁 or your site URL
        "X-Title": "Resume AI Career Coach"
    }

    payload = {
        "model": "deepseek/deepseek-r1:free",
        "messages": [
            {
                "role": "system",
                "content": "You are an AI career coach. Help users improve skills for their desired job."
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions",
                                 headers=headers,
                                 data=json.dumps(payload))
        data = response.json()

        # ✅ Debug print
        print("🔁 OpenRouter reply:", data)

        if "choices" in data:
            reply = data["choices"][0]["message"]["content"]
            return jsonify({"reply": reply})
        elif "error" in data:
            return jsonify({"reply": f"⚠️ AI error: {data['error']['message']}"}), 500
        else:
            return jsonify({"reply": f"⚠️ Unexpected AI response: {data}"}), 500
    except Exception as e:
        return jsonify({"reply": f"⚠️ Exception: {str(e)}"}), 500

# === PDF EXPORT TEST (Optional Future Use) ===
@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    return jsonify({"message": "PDF generation logic goes here"})


if __name__ == "__main__":
    app.run(debug=True)