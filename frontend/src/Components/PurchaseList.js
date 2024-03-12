import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PurchaseList.css';

const PurchaseList = () => {
  const [soldItems, setSoldItems] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSoldItems();
  }, []);

  const fetchSoldItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:3001/solditem/getitems', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'ok') {
        setSoldItems(response.data.soldItems);
      } else {
        throw new Error('Failed to fetch sold items');
      }
    } catch (error) {
      console.error('Error fetching sold items:', error);
      setError('Failed to fetch sold items');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="purchase-container">
      <h2>My Purchased Items</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="purchase-items">
        {soldItems.length > 0 ? (
          soldItems.map((item, index) => (
            <div key={index} className="purchase-item">
              <h3>Item Name: {item.item_name}</h3>
              <p>Item Description: {item.item_description}</p>
              <p>Quantity: {item.item_quantity}</p>
              <p>Amount: {item.item_amount}</p>
              <p>Date Purchased: {new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>You have no purchase orders yet</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseList;
