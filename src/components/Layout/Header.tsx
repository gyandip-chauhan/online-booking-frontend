import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../services/types';
import { toast } from 'react-toastify';
import ApiService from '../../services/apiService';
import { API_LOGOUT } from '../../services/apiEndpoints';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userData: User;
  setUserData: any;
}

const Header: React.FC<HeaderProps> = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState<string>('');

  const handleLogout = async () => {
    try {
      const response = await ApiService.delete(API_LOGOUT);
      console.log("Logout API response:", response)
      localStorage.removeItem('userData');
      setUserData(null)
      navigate('/');
      toast.success(`${response.data.notice}`)
    } catch (error) {
      toast.error(`${error}`)
    }
  };

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  return (
    <div className="header-2">
      <nav className="bg-black py-2 md:py-4">
        <div className="container px-4 mx-auto md:flex md:items-center">
          <div className="flex justify-between items-center">
            <Link to="/" className="font-bold text-xl text-indigo-600">BookMyShow</Link>
            <button className="border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 md:hidden" id="navbar-toggle">
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div className="hidden md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0" id="navbar-collapse">
            {userData ? (
              <>
                <Link
                  to="/"
                  className={`p-2 lg:px-4 md:mx-2 ${activeLink === '/' ? 'text-white rounded bg-indigo-600' : 'text-gray-400 rounded hover:bg-indigo-200 hover:text-indigo-700 transition-colors duration-300'}`}
                  onClick={() => handleLinkClick('/')}
                >
                  Home
                </Link>
                <Link
                  to="/bookings"
                  className={`p-2 lg:px-4 md:mx-2 ${activeLink === '/bookings' ? 'text-white rounded bg-indigo-600' : 'text-gray-400 rounded hover:bg-indigo-200 hover:text-indigo-700 transition-colors duration-300'}`}
                  onClick={() => handleLinkClick('/bookings')}
                >
                  Bookings
                </Link>
                <div className="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center border border-transparent rounded transition-colors duration-300">
                  Welcome, <span className="font-bold">{userData.email}</span>
                </div>
                <button onClick={handleLogout} className="p-2 lg:px-4 md:mx-2 text-gray-400 text-center border border-solid border-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1">Logout</button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`p-2 lg:px-4 md:mx-2 ${activeLink === '/login' ? 'text-white rounded bg-indigo-600' : 'text-gray-400 text-center border border-transparent rounded hover:bg-indigo-100 hover:text-indigo-700 transition-colors duration-300'}`}
                  onClick={() => handleLinkClick('/login')}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`p-2 lg:px-4 md:mx-2 ${activeLink === '/signup' ? 'text-white rounded bg-indigo-600' : 'text-gray-400 text-center border border-solid border-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1'}`}
                  onClick={() => handleLinkClick('/signup')}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
