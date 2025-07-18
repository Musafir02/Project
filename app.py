from flask import Flask, request, jsonify
import openai

openai.api_key = "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"

app = Flask(__name__)

@app.route("/ask", methods=["POST"])
def ask_ai():
    data = request.get_json()
    user_input = data.get("message", "")
    prompt = f"You are a resume coach. Help a user who wants a job at: {user_input}. Suggest resume tips and skills they should include."

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful AI for resume improvement."},
                {"role": "user", "content": prompt}
            ]
        )
        reply = response.choices[0].message.content.strip()
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": "Sorry, I couldn't process that."})

if __name__ == "__main__":
    app.run(debug=True)