import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database setup
def init_db():
    conn = sqlite3.connect('pets.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Initialize the database
init_db()

# Routes
@app.route('/pets', methods=['POST'])
def create_pet():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    image = data.get('image')

    if not name or not description or not image:
        return jsonify({"error": "Missing required fields: name, description, or image"}), 400

    conn = sqlite3.connect('pets.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO pets (name, description, image)
        VALUES (?, ?, ?)
    ''', (name, description, image))
    conn.commit()
    pet_id = cursor.lastrowid
    conn.close()

    return jsonify({"id": pet_id, "name": name, "description": description, "image": image}), 201

@app.route('/pets/<int:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    data = request.json
    name = data.get('name')
    description = data.get('description')
    image = data.get('image')

    if not name or not description or not image:
        return jsonify({"error": "Missing required fields: name, description, or image"}), 400

    conn = sqlite3.connect('pets.db')
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE pets
        SET name = ?, description = ?, image = ?
        WHERE id = ?
    ''', (name, description, image, pet_id))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Pet not found"}), 404

    conn.close()

    return jsonify({"id": pet_id, "name": name, "description": description, "image": image}), 200

@app.route('/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    conn = sqlite3.connect('pets.db')
    cursor = conn.cursor()
    cursor.execute('''
        DELETE FROM pets WHERE id = ?
    ''', (pet_id,))
    conn.commit()

    if cursor.rowcount == 0:
        return jsonify({"error": "Pet not found"}), 404

    conn.close()

    return jsonify({"message": "Pet deleted"}), 200

@app.route('/pets', methods=['GET'])
def get_pets():
    conn = sqlite3.connect('pets.db')
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM pets
    ''')
    pets = cursor.fetchall()
    conn.close()

    pet_list = [
        {"id": pet[0], "name": pet[1], "description": pet[2], "image": pet[3]} for pet in pets
    ]

    return jsonify(pet_list), 200

if __name__ == '__main__':
    app.run(debug=True)
