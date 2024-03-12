import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { jwtDecode } from 'jwt-decode';


const Dashboard = () => {
  const [postItems, setPostItems] = useState([]);
  const [error, setError] = useState('');
  const [showMessage, setShowMessage] = useState(false); // State to control the display of the message pop

  useEffect(() => {
    fetchPostItems();
    // Set interval to fetch updated post items every 10 seconds
    const interval = setInterval(fetchPostItems, 10000);
    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  // Function to fetch post items from the server
  const fetchPostItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/item/all');
      if (response.data.status === 'ok') {
        setPostItems(response.data.postItems);
        fetchBiddingItems(response.data.postItems);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    }
  };

  // Function to fetch bidding items for each post item
  const fetchBiddingItems = async (items) => {
    try {
      const promises = items.map(async (item) => {
        const response = await axios.get(`http://localhost:3001/biditem/getbiditem/${item._id}`);
        return { ...item, biddingItem: response.data.biddingItems };
      });
      const combinedItems = await Promise.all(promises);
      setPostItems(combinedItems);
    } catch (error) {
      console.error('Error fetching bidding items:', error);
      setError('An unexpected error occurred while fetching bidding items.');
    }
  };

  const addToWatchlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      console.log('Adding item to watchlist:', itemId);
      await axios.post(`http://localhost:3001/cart/additem/${itemId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false); // Hide message pop-up after 3 seconds
      }, 3000); // Set timeout for 3 seconds
    } catch (error) {
      console.error('Error adding item to watchlist:', error);
      alert('Failed to add item to watchlist. Please try again later.');
    }
  };

  const handleBidClick = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      // Fetch item details to check the seller ID
      const itemResponse = await axios.get(`http://localhost:3001/item/${itemId}`);
      const item = itemResponse.data.item;

      // Assuming you have the token stored in a variable called 'token'
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      console.log(userId);
      console.log(item.seller_id);

      // Check if the logged-in user is the seller
      if (item.seller_id === userId) {
          throw new Error('You cannot bid on your own item');
      }

      console.log('Placing bid for item:', itemId);
      //update the bid amount and bid count
      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
      };
      fetch(`http://localhost:3001/biditem/update/${itemId}`, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error('BidItem not updated');
            }
            console.log(requestOptions);
          })
          .catch(error => {
            console.log(error);
            console.error('Error updating BidItem:', error);
            // Handle error
          });
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId }) // Assuming itemId is the ID of the item to be added
      };
      
      fetch(`http://localhost:3001/order/additem/${itemId}`, options)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Item added successfully:', data);
        })
        .catch(error => {
          console.error('Error adding item:', error);
        });
        console.log(options);

    } catch (error) {
      console.error('Error placing bid:', error);
      alert(error);
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
            <p>Minimum Bid Amount : {item.minimum_bidamount}</p>
            {/* Display bidding item details */}
            {item.biddingItem && (
              <div>
                <p>Current Amount : {item.biddingItem.current_amount}</p>
                <p>Bidding Count : {item.biddingItem.bidding_count}</p>
              </div>
            )}
            <p>Start Date: {new Date(item.item_startdate).toLocaleDateString()} - End Date: {new Date(item.item_enddate).toLocaleDateString()}</p>
            {/* Add to Watchlist button */}
            <button className="add-to-watchlist-btn" onClick={() => addToWatchlist(item._id)}>Add to Watchlist</button>
            <button className="add-to-watchlist-btn" onClick={() => handleBidClick(item._id)}>Bid</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
