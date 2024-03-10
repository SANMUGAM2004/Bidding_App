import React, { useState } from 'react';
import './Signup.css'; 
import axios from 'axios'; 
//import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  //const history = useHistory(); // Initialize useHistory
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_name: '',
    user_age: '',
    user_email: '',
    user_phonenumber: '',
    user_address: '',
    user_password: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/user/signup', formData);
      console.log(response.data);
      // Reset the form after successful submission
      setFormData({
        user_name: '',
        user_age: '',
        user_email: '',
        user_phonenumber: '',
        user_address: '',
        user_password: ''
      });
    
      //Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input type="text" name="user_name" placeholder="Username" value={formData.user_name} onChange={handleChange} />
        <input type="number" name="user_age" placeholder="Age" value={formData.user_age} onChange={handleChange} />
        <input type="email" name="user_email" placeholder="Email" value={formData.user_email} onChange={handleChange} />
        <input type="tel" name="user_phonenumber" placeholder="Phone Number" value={formData.user_phonenumber} onChange={handleChange} />
        <input type="text" name="user_address" placeholder="Address" value={formData.user_address} onChange={handleChange} />
        <input type="password" name="user_password" placeholder="Password" value={formData.user_password} onChange={handleChange} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
