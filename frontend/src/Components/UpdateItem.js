// UpdateItem.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UpdateItem.css';

const UpdateItem = () => {
  const { id } = useParams(); // Get the item ID from the URL
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    item_quantity: 0,
    item_amount: 0,
    minimum_bidamount: 0,
    item_enddate: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(`http://localhost:3001/item/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === 'ok') {
          const item = response.data.item;
          // Set form data with item details
          setFormData({
            item_name: item.item_name,
            item_description: item.item_description,
            item_quantity: item.item_quantity,
            item_amount: item.item_amount,
            minimum_bidamount: item.minimum_bidamount,
            item_enddate: item.item_enddate
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error fetching item details
      }
    };

    fetchItem();
  }, [id]);

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

      await axios.put(`http://localhost:3001/item/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage('Item updated successfully');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Hide success message after 3 seconds
    } catch (error) {
      console.error('Error updating item:', error);
      // Handle error updating item
    }
  };

  return (
    <div className="update-item-container">
      <h2>Update Item</h2>
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
        <button type="submit">Update Item</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default UpdateItem;
