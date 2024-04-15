import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ApiService from '../../services/apiService';
import { API_MOVIES } from '../../services/apiEndpoints';
import { Movie } from '../../services/types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await ApiService.get(API_MOVIES);
      setMovies(response.data.movies.data);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500
  };
  
  return (
    <div className="bg-white text-gray-800 flex flex-col min-h-screen relative">
      <div className="py-16 px-6 flex-grow flex flex-col justify-center items-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to BookMyShow</h1>
          <p className="text-lg md:text-xl mb-8">Discover and book your favorite movies, events, and more!</p>
          <Link
            to="/movies"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-md inline-block transition-colors duration-300"
          >
            Explore
          </Link>
        </div>
        <div className="w-full relative">
          <Slider {...settings}>
            {movies.map((movie: Movie) => (
              <div key={movie.attributes.id} className="h-full flex items-center justify-center cursor-pointer" onClick={() => handleMovieClick(movie.attributes.id)}>
                <img
                  src={movie.attributes.avatar_url}
                  alt={movie.attributes.title}
                  className="object-cover w-full h-72 md:h-80 lg:h-96 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );    
};

export default Home;
