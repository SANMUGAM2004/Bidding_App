
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import './Dashboard.css';

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
          fetchBiddingItem(postItems);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred.');
      }
    };

    // const fetchBiddingItem = async ()=>{
    //   var finalList = []
    //   postItems.map(async (data)=>{
    //     const response = await axios.get(`http://localhost:3001/biditem/getbiditem/${data._id}`);
    //   console.log(response.data)
    //   const val = response.data.biddingItems

    //     finalList.push({...data, ...val});
    //   })
    //   console.log(finalList)
    //   // setPostItems(finalList);
    // }
    const fetchBiddingItem = async () => {
      try {
        const promises = postItems.map(async (data) => {
          const response = await axios.get(`http://localhost:3001/biditem/getbiditem/${data._id}`);
          return response.data.biddingItems;
        });
        const biddingItemsList = await Promise.all(promises);
        const combinedItems = postItems.map((postItem, index) => {
          return {
            ...postItem,
            biddingItem: biddingItemsList[index] || {} // Use an empty object if no matching bidding item found
          };
        });
        console.log(combinedItems);
        setPostItems(combinedItems);
      } catch (error) {
        console.error('Error:', error);
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
        await axios.post(`http://localhost:3001/cart/additem/${itemId}`,null,  {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return({status : 'ok'.response, message : "success"});
      } 
      catch (error) {
        console.error('Error adding item to watchlist:', error);
        alert('Failed to add item to watchlist. Please try again later.');
      }
      return({status : 'ok'.response, message : "success"});
    };

    const handleBidClick = async (itemId) => {
      try {
        
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        console.log('Adding item to watchlist:', itemId);
        // Send a POST request to add the bid
        await axios.put(`http://localhost:3001/biditem/update/${itemId}`,null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setShowMessage(true); 
        setTimeout(() => {
            setShowMessage(false); // Hide message pop-up after 3 seconds
        }, 3000); // Set timeout for 3 seconds
    } catch (error) {
        console.error('Error placing bid:', error);
        alert('Failed to place bid. Please try again later.');
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
              <button className="bid-btn" onClick={() => handleBidClick(item._id)}>Bid</button>
            </div>
          ))}
        </div>
      </div>
    );
    
  };
  
  export default Dashboard;