import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import CSS for styling
import settings from '../assets/settings.png';
import LoginForm from './LoginForm'; // Import LoginForm component

const Dashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('General'); // Default category
  const [loading, setLoading] = useState(true); // State to track loading
  const [isDarkMode, setIsDarkMode] = useState(false); // State for theme
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State to track login status

  useEffect(() => {
    fetchNews(selectedCategory);
  }, [selectedCategory]);

  const fetchNews = async (category) => {
    setLoading(true); // Set loading to true when starting to fetch news
    try {
      const response = await fetch(`https://news-aggregator-backend-h2br.onrender.com/top-headlines?category=${category}&language=en&page=1&pageSize=80`);
      if (!response.ok) {
        throw new Error(`Failed to fetch news - ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.data.status === 'ok') {
        setArticles(data.data.articles);
      } else {
        throw new Error('Failed to fetch news - Invalid response');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching news
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false); // Set login status to false
    setIsDarkMode(false); // Reset dark mode
    document.body.classList.remove('dark-mode'); // Remove dark mode class
    navigate('/'); // Navigate to login page
  };

  const handleChangeCategory = (category) => {
    setSelectedCategory(category);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  if (!isLoggedIn) {
    return <LoginForm />;
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <nav className="navbar">
        <div className="navbar-left">NewsFeed</div>
        <div className="navbar-right">
          <div className="nav-option">
            <select
              value={selectedCategory}
              onChange={(e) => handleChangeCategory(e.target.value)}
              className="nav-select"
            >
              <option value="General">General</option>
              <option value="Business">Business</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <div className="nav-option hell">
            <i className="fa-regular fa-sun"></i>&nbsp;&nbsp;&nbsp;
            <label className="switch">
              <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
              <span className="slider round"></span>
            </label>&nbsp;&nbsp;&nbsp;
            <i className="fa-regular fa-moon"></i>
          </div>
          <div className="nav-option logout" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </nav>
      <div className="content">
        <h2>Top Headlines ({selectedCategory})</h2>
        {loading ? (
          <div className="loading">
            <img src={settings} alt="Loading" className="loading-image" />
          </div>
        ) : (
          <div className="articles">
            {articles
              .filter(article => article.title !== '[Removed]' && article.urlToImage)
              .map((article, index) => (
                <div key={index} className="article">
                  <img src={article.urlToImage} alt={article.title} className="article-image" />
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <p>{article.publishedAt}</p>
                  <p>{article.content}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
