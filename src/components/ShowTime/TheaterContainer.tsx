import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick'; // Import react-slick
import defaultPoster from './default-poster.svg';
import { Showtime, Theater, Screen } from '../../services/types';

interface TheaterContainerProps {
  showtimes: Showtime[];
  movieId: any;
}

interface GroupedShowtimes {
  theater: Theater;
  screens: { [screenId: string]: { screen: Screen; showtimes: Showtime[] } };
}

const TheaterContainer: React.FC<TheaterContainerProps> = ({ showtimes, movieId }) => {
  const navigate = useNavigate();

  const filteredShowtimes = movieId
    ? showtimes.filter((showtime) => showtime.attributes.movie_id === parseInt(movieId))
    : showtimes;

  const groupedShowtimes: GroupedShowtimes[] = filteredShowtimes.reduce(
    (acc: GroupedShowtimes[], showtime) => {
      const theaterId = showtime.attributes.theater.data.attributes.id;
      const screenId = showtime.attributes.screen.data.attributes.id;

      let theaterIndex = acc.findIndex((group) => group.theater.attributes.id === theaterId);

      if (theaterIndex === -1) {
        acc.push({
          theater: showtime.attributes.theater.data,
          screens: {
            [screenId]: {
              screen: showtime.attributes.screen.data,
              showtimes: [showtime],
            },
          },
        });
      } else {
        if (!acc[theaterIndex].screens[screenId]) {
          acc[theaterIndex].screens[screenId] = {
            screen: showtime.attributes.screen.data,
            showtimes: [],
          };
        }
        acc[theaterIndex].screens[screenId].showtimes.push(showtime);
      }

      return acc;
    },
    []
  );

  const handleBookNowClick = (showtime: Showtime) => {
    const theater = showtime.attributes.theater.data;
    const screen = showtime.attributes.screen.data;
    const movie = showtime.attributes.movie.data;
    const url = `/showtimes/${showtime.attributes.id}?theater_id=${theater.attributes.id}&screen_id=${screen.attributes.id}&movie_id=${movie.attributes.id}`;
    navigate(url);
  };

  return (
    <>
      {groupedShowtimes.map(({ theater, screens }) => (
        <div key={theater.attributes.id} className="theater-container bg-gray-100 p-4 mb-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">{theater.attributes.name}</h2>
          {Object.values(screens).map(({ screen, showtimes }) => (
            <div key={screen.attributes.id} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{screen.attributes.name}</h3>
              {showtimes.length > 3 ? (
                <Slider
                  dots
                  infinite
                  speed={500}
                  slidesToShow={3}
                  slidesToScroll={1}
                  autoplay
                  className="carousel-container"
                >
                  {showtimes.map((showtime) => (
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
                  ))}
                </Slider>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {showtimes.map((showtime) => (
                    <div key={showtime.attributes.id} className="bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg p-4 shadow-md hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1">
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
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default TheaterContainer;
