import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import { API_MOVIES } from '../../services/apiEndpoints';
import MovieCard from './Card';
import { toast } from 'react-toastify';
import { Movie } from '../../services/types';
import { useNavigate } from 'react-router-dom';

const List: React.FC = () => {
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

  const handleMovieClick = (movie: Movie) => {
    navigate(`/showtimes?movie_id=${movie.attributes.id}`);
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.attributes.id} movie={movie} onClick={() => handleMovieClick(movie)} />
        ))}
      </div>
    </div>
  );
};

export default List;
