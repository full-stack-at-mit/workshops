import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pets, setPets] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  
  // Fetch all pets from the backend
  const fetchPets = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/pets');
      if (!response.ok) {
        throw new Error('Failed to fetch pets');
      }
      const data = await response.json();
      setPets(data);
    } catch (error) {
      console.error('Error fetching pets:', error);
      alert('There was an error fetching pets.');
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Handle image upload and encode to base64
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setImage(reader.result);
    };
    
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Handle adding a new pet
  const handleAddPet = async () => {
    const petData = { name, description, image };

    const response = await fetch('http://127.0.0.1:5000/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData)
    });

    if (response.ok) {
      fetchPets();
      setName('');
      setDescription('');
      setImage('');
    }
  };

  // Handle editing a pet
  const handleEditPet = async (petId) => {
    const petData = { name, description, image };

    const response = await fetch(`http://127.0.0.1:5000/pets/${petId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData)
    });

    if (response.ok) {
      fetchPets();
      setName('');
      setDescription('');
      setImage('');
    }
  };

  // Handle deleting a pet
  const handleDeletePet = async (petId) => {
    const response = await fetch(`http://127.0.0.1:5000/pets/${petId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchPets();
    }
  };

  return (
    <div className="App">
      <h1>Pets</h1>
      <div>
        <input
          type="text"
          placeholder="Pet Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Pet Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button onClick={handleAddPet}>Add Pet</button>
      </div>
      
      <div>
        <h2>My pets</h2>
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>
              <h3>{pet.name}</h3>
              <p>{pet.description}</p>
              <img src={pet.image} alt={pet.name} width="100" />
              <button onClick={() => handleEditPet(pet.id)}>Edit</button>
              <button onClick={() => handleDeletePet(pet.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
