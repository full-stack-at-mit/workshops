import React, { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [responseText, setResponseText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (response.ok) {
        console.log("success!")
        const data = await response.json();
        setResponseText(data.response);
      } else {
        setResponseText('Error: Could not get a response.');
      }
    } catch (error) {
      setResponseText('Error: ' + error.message);
    }
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Send a message</h1>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter your message"
        style={{ padding: '10px', width: '300px', marginBottom: '20px' }}
      />
      <br />
      <button
        onClick={handleSubmit}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Submit
      </button>
      <div
        id="responseBox"
        style={{
          marginTop: '20px',
          padding: '10px',
          border: '1px solid #ccc',
          minHeight: '50px',
          backgroundColor: '#f9f9f9',
          marginTop: '20px',
        }}
      >
        {responseText || 'No response yet'}
      </div>
    </div>
  );
}

export default App;
