import React, { useState } from 'react';

function BidPrompt({ onClose }) {
  const handleClick = () => {
    const input = prompt("Enter a bid amount:");
    if (input !== null) {
      console.log("Bid amount entered:", input);
      onClose(); // Close the bid prompt
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Place Bid</button>
    </div>
  );
}

export default BidPrompt;
