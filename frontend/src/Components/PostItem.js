// PostItem.js
import React, { useState } from 'react';
import axios from 'axios';
import './PostItem.css';
import { v4 as uuidv4 } from 'uuid';


const PostItem = () => {
  const [sImage, setSImage] = useState([]);
  const [sImageFile, setSImageFile] = useState([]);
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    item_quantity: 0,
    item_amount: 0,
    minimum_bidamount: 0,
    item_enddate: '',
    item_image : null
  });
  

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      formData.item_image = sImage;
      const response = await axios.post('http://localhost:3001/item/create', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response);
      
      const formData1 = new FormData();
      formData1.append("file",sImageFile);
      const response1 = await axios.post('http://localhost:3001/item/upload', formData1, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
          
        }
      });

      console.log("uploaded",response1.data);
      setShowSuccessMessage(true); // Show success message
      // Clear form data
      setFormData({
        item_name: '',
        item_description: '',
        item_quantity: 0,
        item_amount: 0,
        minimum_bidamount: 0,
        item_enddate: '',
        item_simage :''
      });
      setSImage([]);
      setSImageFile([]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

   // Function to handle file upload
   const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSImageFile(e.target.files[0]);
    setSImage(e.target.value)
    const itemName = formData.item_name.trim().replace(/\s+/g, '');
    const itemId = uuidv4();
    const combinedName = `${itemName}_${itemId}`; 
    console.log(combinedName);
    const renamedFile = new File([file], combinedName, { type: file.type });
    setSImage(combinedName);
    setSImageFile(renamedFile);
    };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Item Name:
          <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} required />
        </label>
        <label>
          Item Description:
          <textarea name="item_description" value={formData.item_description} onChange={handleChange} required />
        </label>
        <label>
          Item Quantity:
          <input type="number" name="item_quantity" value={formData.item_quantity} onChange={handleChange} required />
        </label>
        <label>
          Item Amount:
          <input type="number" name="item_amount" value={formData.item_amount} onChange={handleChange} required />
        </label>
        <label>
          Minimum Bid Amount:
          <input type="number" name="minimum_bidamount" value={formData.minimum_bidamount} onChange={handleChange} required />
        </label>
        <label>
          Item End Date:
          <input type="date" name="item_enddate" value={formData.item_enddate} onChange={handleChange} required />
        </label>
        <label>
          Item Image:
          <input type="file" name="item_image" value={formData.item_image} onChange={handleFileChange} accept="image/*" />
        </label>
        
        <button type="submit">Add Item</button>
      </form>
      {showSuccessMessage && (
        <div className="success-message">
          Item added successfully!
        </div>
      )}
    </div>
  );
};

export default PostItem;