import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css'; // Import CSS for styling
import logo from '../assets/image.png'; // Import the logo image

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasSpecialChar: false,
    hasNumber: false,
  });
  const [passwordVisible, setPasswordVisible] = useState(false); // State to track password visibility
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 7,
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /\d/.test(password),
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(Boolean);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError('Password does not meet the requirements.');
      return;
    }
    try {
      await axios.post('http://localhost:3001/signup', { username, password }).then((result) => {
        console.log(result);
        navigate('/'); // Navigate to the login page
      });
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.'); // Example error handling
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    validatePassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <form onSubmit={handleSignup} className="form">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Signup</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="input"
      />
      <div className="password-input">
        <input
          type={passwordVisible ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
          required
          className="password-field input"
        />
        <i
          className={`fa-regular ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'} cursor-pointer toggle-password-icon`}
          onClick={togglePasswordVisibility}
        ></i>
      </div>
      <div id="passwordRequirements" className="password-requirements">
        <p className="requirements-title" style={{ marginTop: '2px' }}>
          PASSWORD MUST CONTAIN
        </p>
        <ul className="requirements-list">
          <li id="length" className={`requirement ${passwordRequirements.minLength ? 'met' : ''}`}>
            <i className="fa-solid fa-check requirement-icon"></i>
            Minimum Length of 7 Characters
          </li>
          <li id="capital" className={`requirement ${passwordRequirements.hasUppercase ? 'met' : ''}`}>
            <i className="fa-solid fa-check requirement-icon"></i>
            Minimum One Capital Letter
          </li>
          <li id="number" className={`requirement ${passwordRequirements.hasNumber ? 'met' : ''}`}>
            <i className="fa-solid fa-check requirement-icon"></i>
            Minimum One Number
          </li>
          <li id="special" className={`requirement ${passwordRequirements.hasSpecialChar ? 'met' : ''}`}>
            <i className="fa-solid fa-check requirement-icon"></i>
            Minimum One Special Character
          </li>
        </ul>
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit" className="button">
        Signup
      </button>
      <p className="login-link">
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </form>
  );
};

export default SignupForm;
