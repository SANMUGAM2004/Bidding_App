import React, { useState } from 'react';
import "./BidPrompt.css";

function BidPrompt({ onClose, selectedItem }) {
  const [bidAmount, setBidAmount] = useState('');
  console.log(selectedItem);

  const handleChange = (event) => {
    setBidAmount(event.target.value);
  };

  const handleSubmit = () => {
    if (bidAmount.trim() !== '' && bidAmount >= 0) { // Check if bid amount is not empty
      console.log(bidAmount);
      onClose(selectedItem._id,bidAmount); // Pass bid amount to onClose function
    } else {
      // Handle empty bid amount case, e.g., display error message
      console.error('Bid amount cannot be empty');
    }
  };

  return (
    <div className="bid-prompt-container">
      <div className="bid-prompt-content">
        <h3>Item Name: {selectedItem.item_name}</h3>
        <p>Item Description: {selectedItem.item_description}</p>
        <p>Minimum Bid Amount: {selectedItem.minimum_bidamount}</p>
        <p>Current Amount: {selectedItem.biddingItem ? selectedItem.biddingItem.current_amount : 0}</p>
        <p>Minimum Bid Amount: {selectedItem.minimum_bidamount}</p>
        <p>Minimum Bid Amount: {selectedItem.minimum_bidamount}</p>
        
        <input
          type="number"
          value={bidAmount}
          onChange={handleChange}
          min="0"
          placeholder="Enter your bid amount"
        />
        <button class ="bid-button" onClick={handleSubmit}>Submit Bid</button>
        <button class ="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default BidPrompt;
