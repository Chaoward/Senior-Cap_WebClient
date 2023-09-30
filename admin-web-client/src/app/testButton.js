'use client';

export default function Btn() {
    const handleClick = () => {
      alert('You clicked me!');
    }
  
    return (
      <button onClick={handleClick}>
          Click me
      </button>
    );
}