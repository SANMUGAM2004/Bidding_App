// MyPostItems.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyPostItems.css';
import { Link } from 'react-router-dom';

const MyPostItems = () => {
  const [postItems, setPostItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPostItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3001/user/myposts', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.status === 'ok') {
          setPostItems(response.data.postItems);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An unexpected error occurred.');
      }
    };

    fetchPostItems();
  }, []);

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        await axios.delete(`http://localhost:3001/item/delete/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        //delete ffrom watchcart
        await axios.delete(`http://localhost:3001/cart/delete/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        //delete from orderedlist
        await axios.delete(`http://localhost:3001/order/delete/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });


        // Remove the deleted item from the state
        setPostItems(prevItems => prevItems.filter(item => item._id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="mypostitems-container">
      <h2>My Posted Items</h2>
      {error && <div className="error-message">{error}</div>}
      {postItems.length === 0 ? (
        <p>You have not posted any items yet.</p>
      ) : (
        <div className="post-items">
          {postItems.map((item) => (
            <div className="post-item" key={item._id}>
              <h3>{item.item_name}</h3>
              <p>{item.item_description}</p>
              <p>Quantity: {item.item_quantity}</p>
              <p>Amount: {item.item_amount}</p>
              <p>End Date: {new Date(item.item_enddate).toLocaleDateString()}</p>
              <Link to={`/update/${item._id}`}><button className="update-btn">Update</button></Link> {/* Use Link */}
              <button className="delete-btn" onClick={() => handleDeleteItem(item._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostItems;
