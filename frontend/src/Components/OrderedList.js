import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderedList.css';
import { jwtDecode } from 'jwt-decode';

const OrderedList = () => {
  const [orderedlistItems, setOrderedlistItems] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderedlistItems();
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
        // Fetch bidding items for each item ID
        const itemRequests = itemIds.map(itemId =>
          axios.get(`http://localhost:3001/biditem/getbiditem/${itemId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        );

        const itemResponses = await Promise.all(itemRequests);

        const items = itemResponses.map(response => response.data.biddingItems);
        const ordereditems = await Promise.all(itemResponses.map(async response => {
          const itemData = response.data.biddingItems;
          const itemId = itemData.item_id;
          //Retireve the item details...
          const orderedItemResponse = await axios.get(`http://localhost:3001/item/${itemId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
          });
          return orderedItemResponse;
        }));
        const mergedItems = []
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          for(let j = 0; j < ordereditems.length; j++){
              let ordereditem = ordereditems[j];
              // console.log(ordereditem);
              console.log(ordereditem.data.item._id);
              console.log(item.item_id);
              console.log("Comparison result:", item.item_id === ordereditem.data.item._id);
              if(item.item_id === ordereditem.data.item._id){
                  const merged = { ...item, ...ordereditem.data.item };
                  mergedItems.push(merged);
                  console.log(mergedItems);
              }

          }
         
      }
      console.log(mergedItems);
        
        setOrderedlistItems(mergedItems);
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

    // Function to determine if the current user is the buyer of an item
    const isCurrentUserBuyer = (item) => {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        return item.buyer_id === userId;
      }
      return false;
    };
  

  return (
    <div className="orderedlist-container">
      <h2>My Ordered List</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        {orderedlistItems.length > 0 ? (
          orderedlistItems.map((item, index) => (
            <div key={index} className="orderedlist-item">
            <img src={`http://localhost:3001/images/${item.item_image}`}></img>
            <h3>Item Name: {item.item_name}</h3>
            <p>Item Description: {item.item_description}</p>
            <p>Quantity: {item.item_quantity}</p>
            <p>Initial Amount: {item.item_amount}</p>
            <p>Minimum Bid Amount: {item.minimum_bidamount}</p>
            <p>Current Amount: {item.current_amount}</p> 
            <p>Start Date: {new Date(item.item_startdate).toLocaleDateString()} - End Date: {new Date(item.item_enddate).toLocaleDateString()}</p>
            <button className="remove-button" onClick={() => handleRemoveFromOrderedlist(item._id)}>Remove from Ordered List</button>
            
            {isCurrentUserBuyer(item) && <span className="tick">Current Buyer&#10004;</span>}
            {!isCurrentUserBuyer(item) && <span className="tick" style={{ color: 'red' }}>Not Current Buyer&#10006;</span>}
            <button className="bid-button" onClick={() => handleBidClick(item._id)}>Bid</button>
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
