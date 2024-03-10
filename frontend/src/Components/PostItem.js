// PostItem.js
import React, { useState } from 'react';
import axios from 'axios';
import './PostItem.css';

const PostItem = () => {
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    item_quantity: 0,
    item_amount: 0,
    minimum_bidamount: 0,
    item_enddate: ''
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      await axios.post('http://localhost:3001/item/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowSuccessMessage(true); // Show success message
      // Clear form data
      setFormData({
        item_name: '',
        item_description: '',
        item_quantity: 0,
        item_amount: 0,
        minimum_bidamount: 0,
        item_enddate: ''
      });
      // Optionally, you can add code here to redirect or show a success message
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Item Name:
          <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} required />
        </label>
        <label>
          Item Description:
          <textarea name="item_description" value={formData.item_description} onChange={handleChange} required />
        </label>
        <label>
          Item Quantity:
          <input type="number" name="item_quantity" value={formData.item_quantity} onChange={handleChange} required />
        </label>
        <label>
          Item Amount:
          <input type="number" name="item_amount" value={formData.item_amount} onChange={handleChange} required />
        </label>
        <label>
          Minimum Bid Amount:
          <input type="number" name="minimum_bidamount" value={formData.minimum_bidamount} onChange={handleChange} required />
        </label>
        <label>
          Item End Date:
          <input type="date" name="item_enddate" value={formData.item_enddate} onChange={handleChange} required />
        </label>
        <button type="submit">Add Item</button>
      </form>
      {showSuccessMessage && (
        <div className="success-message">
          Item added successfully!
        </div>
      )}
    </div>
  );
};

export default PostItem;
