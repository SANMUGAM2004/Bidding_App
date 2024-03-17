import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SellerDetails = () => {
    const {itemId} =useParams();
    const [item, setItem] = useState(null);
    const [sellerDetails, setSellerDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItemDetails = async () => {
          try {
            const itemResponse = await axios.get(`http://localhost:3001/item/${itemId}`);
            setItem(itemResponse.data.item);
            const sellerId = itemResponse.data.item.seller_id;
            console.log(sellerId);
            const sellerResponse = await axios.get(`http://localhost:3001/user/get/${sellerId}`);
            setSellerDetails(sellerResponse.data.sellerDetails);
            // console.log(sellerDetails);
          } catch (error) {
            console.error('Error fetching item or seller details:', error);
            setError('Failed to fetch item or seller details');
          }
        };
        fetchItemDetails();
      }, [itemId]);

      if (!item || !sellerDetails) {
        return <p>Loading...</p>;
      }

      if (error) {
        return <p>Error: {error}</p>;
      }

      return (
        <div>
            <h2>Item Details</h2>
            <img src={`http://localhost:3001/images/${item.item_image}`}></img>
            <p>Item Name: {item.item_name}</p>
            <p>Item Description: {item.item_description}</p>
            <p>Quantity : {item.item_quantity}</p>
            <p>Initial Amount : {item.item_amount}</p>
            <p>Minimum Bid Amount : {item.minimum_bidamount}</p>
          
          <h2>Seller Details</h2>
          <p>Seller Name: {sellerDetails.user_name}</p>
          <p>Seller Age: {sellerDetails.user_age}</p>
          <p>Seller Email: {sellerDetails.user_email}</p>
          <p>Seller Phone Number: {sellerDetails.user_phonenumber}</p>
          <p>Seller Address: {sellerDetails.user_address}</p>
        </div>
      );
};



export default SellerDetails;