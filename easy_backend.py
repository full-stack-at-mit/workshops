from flask import Flask, request, jsonify
from flask_cors import CORS

# Setup CORS
app = Flask(__name__)
CORS(app)

@app.route('/chat', methods=['POST'])
def chat():
    try:
        # Get text from request
        data = request.json
        user_message = data.get('text')

        if not user_message:
            return jsonify({'error': 'No text provided'}), 400

        # Return the response
        return jsonify({'response': 'Response received!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
