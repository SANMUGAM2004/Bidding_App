import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderedList.css';

const OrderedList = () => {
  const [orderedlistItems, setOrderedlistItems] = useState([]);
  
  useEffect(() => {
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
                // Extract item IDs from the orderedlist items
                const itemIds = response.data.orderlistItems.map(item => item.item_id);
                // Fetch item details for each item ID
                const itemRequests = itemIds.map(itemId =>
                    axios.get(`http://localhost:3001/item/${itemId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                );
                // Wait for all item requests to complete
                const itemResponses = await Promise.all(itemRequests);
                // Extract item details from responses
                const items = itemResponses.map(response => response.data.item);
                // Update state with item details
                setOrderedlistItems(items);
            } else {
                throw new Error('Failed to fetch ordered items');
            }
        } catch (error) {
            console.error('Error fetching ordered items:', error);
        }
    };

    fetchOrderedlistItems();
}, []);

// Function to handle removing an item from ordered list
const handleRemoveFromOrderedlist = async (itemId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
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

  return (
    <div className="orderedlist-container">
      <h2>My Ordered List</h2>
      <div className="orderedlist-items">
        {orderedlistItems.map(item => (
          <div key={item._id} className="orderedlist-item">
            <h3>Item Name : {item.item_name}</h3>
            <p>Item Description : {item.item_description}</p>
            <p>Quantity : {item.item_quantity}</p>
            <p>Initial Amount : {item.item_amount}</p>
            <p>Start Date: {new Date(item.item_startdate).toLocaleDateString()} - End Date: {new Date(item.item_enddate).toLocaleDateString()}</p>
            {/* Button to remove item from ordered list */}
            <button onClick={() => handleRemoveFromOrderedlist(item._id)}>Remove from Ordered List</button>
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div> 
  );
};

export default OrderedList;
