import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Watchlist.css';

const Watchlist = () => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWatchlistItems();
  }, []);

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
        // Extract item IDs from the watchlist items
        const itemIds = response.data.watchcartItems.map(item => item.item_id);
        // Fetch bidding items for each item ID
        const itemRequests = itemIds.map(itemId =>
          axios.get(`http://localhost:3001/biditem/getbiditem/${itemId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        );

        // Wait for all item requests to complete
        const itemResponses = await Promise.all(itemRequests);

        // Extract bidding items from responses and  update state
        //console.log(watchlistItems);
        const items = itemResponses.map(response => response.data.biddingItems);
        const postitems = await Promise.all(itemResponses.map(async response => {
            const itemData = response.data.biddingItems;
            const itemId = itemData.item_id;
            // console.log(itemId);
            //Retireve the item details...
            const postItemResponse = await axios.get(`http://localhost:3001/item/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return postItemResponse;
        }));
        
        // // Merge items and postitems arrays
        // const mergedItems = [...items, ...postitems];
        const mergedItems = []
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            // const matchingPostItem = postitems.find(postitem => postitem.item_id === item.item_id);
            for(let j = 0; j < postitems.length; j++){
                let postitem = postitems[j];
                // console.log(postitem);
                console.log(postitem.data.item._id);
                console.log(item.item_id);
                console.log("Comparison result:", item.item_id === postitem.data.item._id);
                if(item.item_id === postitem.data.item._id){
                    
                    const merged = { ...item, ...postitem.data.item };
                    mergedItems.push(merged);
                    console.log(mergedItems);
                }

            }
           
        }
        console.log(mergedItems);

        setWatchlistItems(mergedItems);
      } else {
        throw new Error('Failed to fetch watchlist items');
      }
    } catch (error) {
      console.error('Error fetching watchlist items:', error);
      setError('Failed to fetch watchlist items');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle removing an item from watchlist
  const handleRemoveFromWatchlist = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Display confirmation dialog before deleting
      const confirmed = window.confirm('Are you sure you want to remove this item from the watchlist?');
      if (!confirmed) {
        return; // If not confirmed, do nothing
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
    <div className="watchlist-items">
    {watchlistItems.length > 0 ? (
        watchlistItems.map((item, index) => (
        <div key={index} className="watchlist-item">
            <h3>Item Name : {item.item_name}</h3>
            <p>Item Description : {item.item_description}</p>
            <p>Quantity : {item.item_quantity}</p>
            <p>Initial Amount : {item.item_amount}</p>
            <p>Current Amount : {item.current_amount}</p>
            <p>Start Date: {new Date(item.item_startdate).toLocaleDateString()} - End Date: {new Date(item.item_enddate).toLocaleDateString()}</p>
            {/* Button to remove item from watchlist */}
            <button onClick={() => handleRemoveFromWatchlist(item._id)}>Remove from Watchlist</button>
        </div>
        ))
    ) : (
        <p>No items in the watchlist</p>
    )}
    </div>
  );
};

export default Watchlist;