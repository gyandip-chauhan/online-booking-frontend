import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './components/Layout/Home';
import LoginForm from './components/Authentication/LoginForm';
import SignupForm from './components/Authentication/SignupForm';
import ForgotPasswordForm from './components/Authentication/ForgotPasswordForm';
import ResetPasswordForm from './components/Authentication/ResetPasswordForm';
import ResendConfirmationForm from './components/Authentication/ResendConfirmationForm';
import ShowTimeList from './components/ShowTime/List';
import ShowTimeDetails from './components/ShowTime/Details';
import InvoicePage from './components/Booking/Invoice';
import BookingList from './components/Booking/List';
import MovieList from './components/Movie/List';
import MovieDetails from './components/Movie/Details';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';

const App = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      if (parsedUserData.token) {
        setUserData(parsedUserData);
      } else {
        localStorage.removeItem('userData');
      }
    }
  }, []);

  return (
    <Router>
      <ToastContainer position="top-center"/>
      <div className="app-container min-h-screen flex flex-col">
        <Header userData={userData} setUserData={setUserData}/>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm setUserData={setUserData} />} />
            <Route path="/signup" element={<SignupForm setUserData={setUserData}/>} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/resend-confirmation" element={<ResendConfirmationForm />} />
            <Route path="/movies" element={<MovieList />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/showtimes" element={<ShowTimeList />} />
            <Route path="/showtimes/:id" element={<ShowTimeDetails />} />
            {userData && (
              <>
                <Route path="/bookings/:id/invoice" element={<InvoicePage />} />
                <Route path="/bookings" element={<BookingList />} />
              </>
            )}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
