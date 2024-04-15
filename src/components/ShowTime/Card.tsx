import React from 'react';
import { Showtime } from '../../services/types';
import { useNavigate } from 'react-router-dom';
import defaultPoster from './default-poster.svg';

interface CardProps {
  showtime: Showtime;
}

const Card: React.FC<CardProps> = ({ showtime }) => {
  const navigate = useNavigate();
  
  const handleBookNowClick = (showtime: Showtime) => {
    const theater = showtime.attributes.theater.data;
    const screen = showtime.attributes.screen.data;
    const movie = showtime.attributes.movie.data;
    const url = `/showtimes/${showtime.attributes.id}?theater_id=${theater.attributes.id}&screen_id=${screen.attributes.id}&movie_id=${movie.attributes.id}`;
    navigate(url);
  };

  return (
    <div key={showtime.attributes.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
        <img
        src={showtime.attributes.movie.data.attributes.avatar_url || defaultPoster}
        alt="Movie Poster"
        className="mx-auto mb-4 rounded-lg object-cover w-full h-64"
        />
        <div className="text-center">
        <h4 className="text-lg font-semibold mb-2">{showtime.attributes.movie.data.attributes.title}</h4>
        <p className="text-sm mb-2">Date & Time: {new Date(showtime.attributes.time).toLocaleString()}</p>
        <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg" onClick={() => handleBookNowClick(showtime)}>
            Book Now
        </button>
        </div>
    </div>
  );
};

export default Card;
