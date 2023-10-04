'use client';

import { useState } from "react";

export default function Btn() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
      setCount(count + 1);
    }
  
    return (
      <button onClick={handleClick}>
          Click me {count}
      </button>
    );
}