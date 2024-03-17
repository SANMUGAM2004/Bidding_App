import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import BidPrompt from './BidPrompt.js';


const Dashboard = () => {
  const [postItems, setPostItems] = useState([]);
  const [error, setError] = useState('');
  const [showMessage, setShowMessage] = useState(false); 
  const [showBidPrompt, setShowBidPrompt] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    fetchPostItems();    
  }, []);

  // Function to fetch post items from the server
  const fetchPostItems = async () => {
    try {
      const response = await axios.get('http://localhost:3001/item/all');
      if (response.data.status === 'ok') {
        setPostItems(response.data.postItems);
        fetchBiddingItem(response.data.postItems);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No item on the Dashboard yet');
    }
  };
  //==============================================================================================

    // Function to fetch bidding items for each post item
  const fetchBiddingItem = async (items) => {
    try {
      const promises = items.map(async (item) => {
        const response = await axios.get(`http://localhost:3001/biditem/getbiditem/${item._id}`);
        console.log({ ...item, biddingItem: response.data.biddingItems });
        return { ...item, biddingItem: response.data.biddingItems };
      });
      const combinedItems = await Promise.all(promises);
      setPostItems(combinedItems);
    } catch (error) {
      console.error('Error fetching bidding items:', error);
      setError('An unexpected error occurred while fetching bidding items.');
    }
  };

//-------------------------------------------------------------------------------------------------

  const fetchBiddingItems = async (itemId) => {
    try {
      const response = await axios.get(`http://localhost:3001/biditem/getbiditem/${itemId}`);
      return response.data.biddingItems;
    } catch (error) {
      console.error('Error fetching bidding item:', error);
      throw new Error('An unexpected error occurred while fetching bidding item.');
    }
  };
//------------------------------------------------------------------------------------------------
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

  //====================================================================================

  const handleBidClick = async (itemId) => {
    try {
      setShowBidPrompt(true);
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
      // Update the bid amount and bid count
      const bidItemResponse = await axios.put(`http://localhost:3001/biditem/update/${itemId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (bidItemResponse.data.status === 'ok') {
        console.log('Bid placed successfully');
        // Fetch the updated bidding details for this item only
        const biddingItem = await fetchBiddingItems(itemId);
        // Update the state of the specific item with the new bidding details
        setPostItems(prevPostItems => {
          return prevPostItems.map(item => {
            if (item._id === itemId) {
              return { ...item, biddingItem };
            }
            return item;
          });
        });
      } else {
        throw new Error('Failed to update bid item');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      alert(error);
    }
  };
  

  const navigate = useNavigate();
  const handleSellerDetailsClick = (itemId) => {
    navigate(`/seller/${itemId}`);
  }


  // const handleBidClick = async (itemId) => {
  //   console.log("clicked");
  //   console.log(itemId);
  //   setSelectedItemId(itemId);
  //   setShowBidPrompt(true);
  // };

  // const handleCloseBidPrompt = () => {
  //   setShowBidPrompt(false); // Hide the bid prompt
  // };


  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {error && <div className="error-message">{error}</div>}
      {/* Message pop-up */}
      {showMessage && <div className="message-pop">Item added to your watchlist!</div>}
      <div className="post-items-container">
        {postItems.map((item) => (
          <div className="post-item" key={item._id}>
            <img src={`http://localhost:3001/images/${item.item_image}`}></img>
            <h3 onClick={() => handleSellerDetailsClick(item._id)}>Item Name : {item.item_name}</h3>
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
            {/* {selectedItemId === item._id && <BidPrompt onClose={handleCloseBidPrompt} />} */}
          </div>
          
        ))}
      </div>
      
    </div>
  );
};

export default Dashboard;
