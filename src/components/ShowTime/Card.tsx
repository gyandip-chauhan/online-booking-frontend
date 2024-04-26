import React from 'react';
import { Showtime, Theater, Screen } from '../../services/types';
import { useNavigate } from 'react-router-dom';
import { Star as StarIcon, LocationOn as LocationIcon } from '@mui/icons-material';

interface CardProps {
  showTimes: Showtime[];
}

interface GroupedShowtimes {
  theater: Theater;
  screens: { [screenId: string]: { screen: Screen; showtimes: Showtime[] } };
}

const Card: React.FC<CardProps> = ({ showTimes }) => {
  const navigate = useNavigate();

  const groupedShowtimes: GroupedShowtimes[] = showTimes.reduce(
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

  const formatShowtime = (time: any) => {
    const date = new Date(time);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  if (!showTimes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="showtime-listing mt-8">
      {groupedShowtimes.length === 0 ? (
        <div className="bg-white mb-8 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-900 text-lg font-bold">No showtimes available</p>
          <p className="text-gray-700 mt-2">Please check back later or select a different date.</p>
        </div>
      ) : (
        groupedShowtimes.map(({ theater, screens }) => (
          <div key={theater.attributes.id} className="bg-white mb-8 rounded-lg shadow-md p-6 lg:flex lg:items-center justify-between">
            {/* Theater Details */}
            <div className="lg:w-1/4">
              <div className="flex items-center">
                <StarIcon className="text-yellow-500 text-2xl" />
                <h2 className="font-bold text-lg text-gray-900 ml-2">{theater.attributes.name}</h2>
              </div>
              <div className="flex items-center mt-2">
                <LocationIcon className="text-gray-500 text-sm" />
                <p className="text-sm text-gray-700 ml-1">{theater.attributes.location}</p>
              </div>
            </div>
            
            {/* Screen Details */}
            <div className="lg:w-4/6 overflow-x-auto">
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {Object.values(screens).map(({ screen, showtimes }) => (
                  <div key={screen.attributes.id} className="bg-blue-100 rounded-lg shadow-md p-4">
                    <h3 className="font-bold text-sm text-gray-900">{screen.attributes.name}</h3>
                    <div className="flex flex-wrap mt-2">
                      {showtimes.map((showtime) => (
                        <button
                          key={showtime.attributes.id}
                          onClick={() => handleBookNowClick(showtime)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-md mb-2 cursor-pointer mr-2"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          {formatShowtime(showtime.attributes.time)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Cancellation Notice */}
            <div className="lg:w-1/6 text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-md inline-block">Cancellation Available</div>
          </div>
        ))
      )}
    </div>
  );
};

export default Card;
