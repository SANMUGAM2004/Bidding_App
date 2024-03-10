import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  
  useEffect(() => {
    const fetchWatchlistItems = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.get('http://localhost:3001/cart/getitems', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.status === 'ok') {
                // Extract item IDs from the watchcart items
                const itemIds = response.data.watchcartItems.map(item => item.item_id);
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
                setWatchlistItems(items);
            } else {
                throw new Error('Failed to fetch watchlist items');
            }
        } catch (error) {
            console.error('Error fetching watchlist items:', error);
        }
    };

    fetchWatchlistItems();
}, []);

// Function to handle removing an item from watchlist
const handleRemoveFromWatchlist = async (itemId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // Send request to remove item from watchlist
        await axios.delete(`http://localhost:3001/cart/deleteitem/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        // Update watchlist items after removing the item
        setWatchlistItems(prevItems => prevItems.filter(item => item._id !== itemId));
    } catch (error) {
        console.error('Error removing item from watchlist:', error);
    }
};

  return (
    <div className="watchlist-container">
      <h2>My Watchlist</h2>
      <div className="watchlist-items">
        {watchlistItems.map(item => (
          <div key={item._id} className="watchlist-item">
            <h3>Item Name : {item.item_name}</h3>
            <p>Item Description : {item.item_description}</p>
            <p>Quantity : {item.item_quantity}</p>
            <p>Initial Amount : {item.item_amount}</p>
            <p>Start Date: {new Date(item.item_startdate).toLocaleDateString()} - End Date: {new Date(item.item_enddate).toLocaleDateString()}</p>
            {/* Button to remove item from watchlist */}
            <button onClick={() => handleRemoveFromWatchlist(item._id)}>Remove from Watchlist</button>
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
