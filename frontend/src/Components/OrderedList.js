import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderedList.css';

const OrderedList = () => {
  const [orderedlistItems, setOrderedlistItems] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderedlistItems();
    const interval = setInterval(fetchOrderedlistItems, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrderedlistItems = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get('http://localhost:3001/order/getitems', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === 'ok') {
        const itemIds = response.data.orderedlistItems.map(item => item.item_id);
        const itemRequests = itemIds.map(itemId =>
          axios.get(`http://localhost:3001/item/${itemId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        );

        const itemResponses = await Promise.all(itemRequests);
        const items = itemResponses.map(response => response.data.item);
        setOrderedlistItems(items);
      } else {
        throw new Error('Failed to fetch ordered items');
      }
    } catch (error) {
      console.error('Error fetching ordered items:', error);
      setError('Failed to fetch ordered items');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle removing an item from ordered list
const handleRemoveFromOrderedlist = async (itemId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    // Display confirmation dialog before deleting
    const confirmed = window.confirm('Are you sure you want to remove this item from the ordered list?');
    if (!confirmed) {
      return; // If not confirmed, do nothing
    }

    // Send request to remove item from ordered list
    await axios.delete(`http://localhost:3001/order/deleteitem/${itemId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Update ordered list items after removing the item
    setOrderedlistItems(prevItems => prevItems.filter(item => item._id !== itemId));
  } catch (error) {
    console.error('Error removing item from ordered list:', error);
  }
};


  const handleBidClick = async (itemId) => {
    // Implement your bidding logic here
    console.log('Placing bid for item:', itemId);
  };

  return (
    <div className="orderedlist-container">
      <h2>My Ordered List</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div className="orderedlist-items">
        {orderedlistItems.length > 0 ? (
          orderedlistItems.map((item, index) => (
            <div key={index} className="orderedlist-item">
              <h3>Item Name: {item.item_name}</h3>
              <p>Item Description: {item.item_description}</p>
              <p>Quantity: {item.item_quantity}</p>
              <p>Initial Amount: {item.item_amount}</p>
              <p>Current Amount: {item.current_amount}</p> {/* Display current amount */}
              <p>Minimum Bid Amount: {item.minimum_bidamount}</p> {/* Display minimum bid amount */}
              <p>Start Date: {new Date(item.item_startdate).toLocaleDateString()} - End Date: {new Date(item.item_enddate).toLocaleDateString()}</p>
              <button onClick={() => handleRemoveFromOrderedlist(item._id)}>Remove from Ordered List</button>
              <button onClick={() => handleBidClick(item._id)}>Bid</button> {/* Add bid button */}
            </div>
          ))
        ) : (
          <p>No items in the ordered list</p>
        )}
      </div>
    </div>
  );
};

export default OrderedList;
