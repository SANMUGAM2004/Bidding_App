
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [postItems, setPostItems] = useState([]);
  const [error, setError] = useState('');
  const [showMessage, setShowMessage] = useState(false); // State to control the display of the message pop

  useEffect(() => {
    // Fetch all post items from the server and start interval for fetching bidding details
    const fetchPostItems = async () => {
      try {
        const response = await axios.get('http://localhost:3001/item/all');
        if (response.data.status === 'ok') {
          setPostItems(response.data.postItems);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred.');
      }

      fetchBiddingDetails(); // Fetch bidding details immediately after fetching post items
      const intervalId = setInterval(fetchBiddingDetails, 10000); // Start interval for fetching bidding details every 10 seconds
      return () => clearInterval(intervalId); // Clean up interval on component unmount
    };

    fetchPostItems();
  }, []);

  // Function to fetch bidding details
  const fetchBiddingDetails = async () => {
    // Your code to fetch bidding details
  };

  const addToWatchlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      await axios.post(`http://localhost:3001/cart/additem/${itemId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setShowMessage(true); // Display message pop-up
      setTimeout(() => {
        setShowMessage(false); // Hide message pop-up after 3 seconds
      }, 3000); // Set timeout for 3 seconds
    } catch (error) {
      console.error('Error adding item to watchlist:', error);
      alert('Failed to add item to watchlist. Please try again later.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {error && <div className="error-message">{error}</div>}
      {/* Message pop-up */}
      {showMessage && <div className="message-pop">Item added to your watchlist!</div>}
      <div className="post-items-container">
        {postItems.map((item) => (
          <div className="post-item" key={item._id}>
            <h3>Item Name : {item.item_name}</h3>
            <p>Item Description : {item.item_description}</p>
            <p>Quantity : {item.item_quantity}</p>
            <p>Initial Amount : {item.item_amount}</p>
            <p>Start Date: {new Date(item.item_startdate).toLocaleDateString()} - End Date: {new Date(item.item_enddate).toLocaleDateString()}</p>
            {/* Add to Watchlist button */}
            <p>Minimum Amount for Bidding : {item.minimum_bidamount} </p>
            <p>Bidding Amount: {item.bidding_amount}</p>
            <p>Bidding Count: {item.bidding_count}</p>
            <button className="add-to-watchlist-btn" onClick={() => addToWatchlist(item._id)}>Add to Watchlist</button>
            {/* Add more details to display */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;