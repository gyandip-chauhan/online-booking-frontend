import React from 'react';
import { Movie } from '../../services/types';
import defaultPoster from './default-poster.svg';

interface CardProps {
  movie: Movie;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ movie, onClick }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer" onClick={onClick}>
          <img
            src={movie.attributes.avatar_url || defaultPoster}
            alt="Movie Poster"
            className="w-full h-64 object-cover rounded-t-lg"
          />
          <div className="p-6">
            <h4 className="text-lg font-bold mb-2">{movie.attributes.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{movie.attributes.description}</p>
            {/* <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-blue-400"
              onClick={onClick}
            >
              View Showtimes
            </button> */}
          </div>
        </div>
      );
};

export default Card;
