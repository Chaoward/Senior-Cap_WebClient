'use client'
import React, { useState } from 'react';
import './globals.css'; 

const ImageBox = () => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [message, setMessage] = useState('');

  const [counter, setCounter] = useState(0);
  const [totalPending, setTotalPending] = useState(100);

  const handleSendCount = () => {
    setMessage('Send button clicked. Selected choice: ' + selectedChoice);
    console.log('Send button clicked. Selected choice:', selectedChoice);
    
    // Update the counter and totalPending state when Send button is clicked
    setCounter(counter + 1);
    setTotalPending(totalPending - 1);
  };


  const handleChoiceChange = (event) => {
    setSelectedChoice(event.target.value);
  };

  const handleFetchClick = () => {
    setMessage('Fetch button clicked');
    console.log('Fetch button clicked');
  };

  const handleSendClick = () => {
    setMessage('Send button clicked. Selected choice: ' + selectedChoice);
    console.log('Send button clicked. Selected choice:', selectedChoice);
  };

  const handleBothClicks = () => {
    handleSendClick();
    handleSendCount();
  };

  return (
    <div className="image-box">
       <div className="counter-text">{counter}/{totalPending} pending</div>
      <div className="button-container">
        <button onClick={handleFetchClick}>Fetch</button>
        <button onClick={handleBothClicks}>Send</button>
      </div>
      <div className="image-container">
        <div className="border-box"></div>
        <img
          src={'https://upload.wikimedia.org/wikipedia/commons/4/43/Cute_dog.jpg'}
          alt="Image 1"
          className="image"
        />
      
      </div>
      <div className="choices">
        <label>
          <input
            type="radio"
            name="animalChoice"
            value="cat"
            checked={selectedChoice === 'cat'}
            onChange={handleChoiceChange}
          />
          Cat
        </label>
        <label>
          <input
            type="radio"
            name="animalChoice"
            value="dog"
            checked={selectedChoice === 'dog'}
            onChange={handleChoiceChange}
          />
          Dog
        </label>
        <label>
          <input
            type="radio"
            name="animalChoice"
            value="neither"
            checked={selectedChoice === 'neither'}
            onChange={handleChoiceChange}
          />
          Neither
        </label>
      </div>
      {message && <div className="message">{message}</div>}

      <div className="image-container">
        <div className="border-box"></div>
        <img
          src={'https://www.petsworld.in/blog/wp-content/uploads/2014/09/funny-cat.jpg'}
          alt="Image 2"
          className="image"
        />
      </div>
      <div className="choices">
        <label>
          <input
            type="radio"
            name="animalChoice"
            value="cat"
            checked={selectedChoice === 'cat'}
            onChange={handleChoiceChange}
          />
          Cat
        </label>
        <label>
          <input
            type="radio"
            name="animalChoice"
            value="dog"
            checked={selectedChoice === 'dog'}
            onChange={handleChoiceChange}
          />
          Dog
        </label>
        <label>
          <input
            type="radio"
            name="animalChoice"
            value="neither"
            checked={selectedChoice === 'neither'}
            onChange={handleChoiceChange}
          />
          Neither
        </label>
      </div>
      {message && <div className="message">{message}</div>}
    </div>
    
  );
};

export default ImageBox;
