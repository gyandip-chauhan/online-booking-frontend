import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import { useParams } from 'react-router-dom';
import { API_MOVIE_DETAILS } from '../../services/apiEndpoints';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Details: React.FC = () => {
const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchMovie();
  }, []);

  const fetchMovie = async () => {
    if (id){
        try {
          const response = await ApiService.get(API_MOVIE_DETAILS(id));
          console.log("response", response)
          setMovie(response.data.movie.data.attributes);
        } catch (error) {
          toast.error(`${error}`);
        }
    }
  };

  const handleMovieClick = (movie: any) => {
    navigate(`/showtimes?movie_id=${movie?.id}`);
  };

  return (
    <div className="bg-white text-gray-800 flex flex-col min-h-screen relative">
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <img
              src={movie?.avatar_url}
              alt={movie?.title}
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="md:w-1/2 md:pl-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{movie?.title}</h1>
            <p className="text-lg">{movie?.description}</p>
            <div className="mt-6">
              <button
                onClick={() => handleMovieClick(movie)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-md inline-block transition-colors duration-300"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
