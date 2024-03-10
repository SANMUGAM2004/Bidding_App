import React, { useState } from 'react';
import './Login.css'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const Login = ({ handleLogin }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    user_email: '',
    user_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/user/login', formData);
      console.log(response.data);
      if (response.data.status === 'ok') {
        setError(''); // Clear any previous error

        handleLogin(response.data.token);
        // Navigate to dashboard if login is successful
        navigate('/dashboard');
      } else {
        setError(response.data.message); // Set the error message received from the backend
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.'); // Set a generic error message
    }
  };

  
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input type="email" name="user_email" placeholder="Email" value={formData.user_email} onChange={handleChange} />
        <input type="password" name="user_password" placeholder="Password" value={formData.user_password} onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Login;
