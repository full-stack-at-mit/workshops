from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from flask_cors import CORS
from openai import OpenAI
import time

# Setup CORS
app = Flask(__name__)
CORS(app)

# Get environment variables
load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
assistant_id = 'asst_AIUwg96COpnDPsX0I8ojWxwu'

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get text from request
        data = request.json
        user_message = data.get('text')

        if not user_message:
            return jsonify({'error': 'No text provided'}), 400

        # Send text to OpenAI API
        thread = client.beta.threads.create()
        thread_id = thread.id
        client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content=user_message,
        )
        run = client.beta.threads.runs.create(thread_id=thread_id, assistant_id=assistant_id)
        while True:
            response = client.beta.threads.runs.retrieve(run_id=run.id, thread_id=thread_id)
            if response.status not in ["in_progress", "queued"]:
                break
            time.sleep(1)
        message_list = client.beta.threads.messages.list(thread_id)
        assistant_response = next((msg for msg in message_list.data if msg.run_id == run.id and msg.role == 'assistant'), None).content[0].text.value

        # Return the response
        return jsonify({'response': assistant_response}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
