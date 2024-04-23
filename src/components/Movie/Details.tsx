import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import { useParams } from 'react-router-dom';
import { API_MOVIE_DETAILS } from '../../services/apiEndpoints';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { MovieCastAndCrew } from '../../services/types';
import { Button } from '@material-ui/core';

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>({});
  const [movieCasts, setMovieCasts] = useState<MovieCastAndCrew[]>([]);
  const [movieCrews, setMovieCrews] = useState<MovieCastAndCrew[]>([]);
  const [showVideoIframe, setShowVideoIframe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovie();
  }, []);

  const fetchMovie = async () => {
    if (id) {
      try {
        const response = await ApiService.get(API_MOVIE_DETAILS(id));
        setMovie(response.data.movie.data.attributes);
        setMovieCasts(response.data.movie.data.attributes.casts.data);
        setMovieCrews(response.data.movie.data.attributes.crews.data);
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  const handleMovieClick = () => {
    setShowVideoIframe(true);
  };

  const handleCloseVideoModal = () => {
    setShowVideoIframe(false);
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        {/* Movie details */}
        {movie ? (
          <div className="flex flex-col lg:flex-row lg:space-x-12">
            {/* Movie poster or trailer */}
            <div className="lg:w-1/2 mb-8 lg:mb-0 relative">
              {/* If trailer is playing, show iframe */}
              {showVideoIframe && movie.trailer_url ? (
                <iframe
                  width="728"
                  height="385"
                  src={`${movie.trailer_url}&autoplay=1&mute=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; fullscreen; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
                  className="rounded-lg shadow-lg"
                ></iframe>
              ) : (
                <div className="relative">
                  <img
                    src={movie.avatar_url}
                    alt={movie.title}
                    className="w-full h-96 rounded-lg shadow-lg cursor-pointer"
                    onClick={handleMovieClick}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faPlay}
                      className="h-24 w-24 text-white opacity-75 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                      onClick={handleMovieClick}
                    />
                  </div>
                </div>
              )}
              {/* Close video modal button */}
              {showVideoIframe && (
                <button
                  className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 rounded-md"
                  onClick={handleCloseVideoModal}
                >
                  Close
                </button>
              )}
            </div>
            {/* Movie details */}
            <div className="lg:w-1/2">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{movie.title}</h1>
              <p className="text-lg mb-6">{movie.description}</p>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/showtimes?movie_id=${movie.id}`)}
                  className="inline-block transition-colors duration-300"
                >
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg">Loading...</p>
        )}

        {/* Cast section */}
        {movieCasts.length > 0 && (
          <section className="my-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Cast</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Mapping through movie casts */}
              {movieCasts.map((cast) => (
                <div key={cast.attributes.id} className="flex flex-col items-center">
                  <img
                    src={cast.attributes.image_url}
                    alt={cast.attributes.name}
                    className="w-32 h-32 rounded-full mb-2"
                  />
                  <h4 className="text-lg font-semibold">{cast.attributes.name}</h4>
                  <p className="text-sm text-gray-600">{cast.attributes.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Crew section */}
        {movieCrews.length > 0 && (
          <section className="my-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Crew</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Mapping through movie crews */}
              {movieCrews.map((crew) => (
                <div key={crew.attributes.id} className="flex flex-col items-center">
                  <img
                    src={crew.attributes.image_url}
                    alt={crew.attributes.name}
                    className="w-32 h-32 rounded-full mb-2"
                  />
                  <h4 className="text-lg font-semibold">{crew.attributes.name}</h4>
                  <p className="text-sm text-gray-600">{crew.attributes.role}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Details;
