import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ApiService from '../../services/apiService';
import { API_SHOWTIME_DETAILS } from '../../services/apiEndpoints';
import screenIcon from './screen-icon.png';
import StripeContainer from '../Payment/StripeContainer';
import { toast } from 'react-toastify';

const Details: React.FC = ({setStripeOptions}: any) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const theater_id = searchParams.get('theater_id');
  const screen_id = searchParams.get('screen_id');
  const movie_id = searchParams.get('movie_id');
  const [showtimeData, setShowtimeData] = useState<any>(null);
  const [theaterData, setTheaterData] = useState<any>(null);
  const [movieData, setMovieData] = useState<any>(null);
  const [seatCategoryData, setSeatCategoryData] = useState<any>(null);
  const [showtimeSeatGroupBySc, setShowtimeSeatGroupBySc] = useState<any>({});
  const [selectedSeats, setSelectedSeats] = useState<any>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [paymentPopup, setPaymentPopup] = useState<boolean>(false);

  useEffect(() => {
    fetchShowtimeData();
  }, []);
  
  const fetchShowtimeData = async () => {
    if (id && theater_id && screen_id && movie_id) {
      try {
        const response = await ApiService.get(API_SHOWTIME_DETAILS(id, theater_id, screen_id, movie_id));
        setShowtimeData(response.data.showtime);
        setSeatCategoryData(response.data.seat_categories);
        setShowtimeSeatGroupBySc(response.data.showtime_seats_group_by_sc)
        setTheaterData(response.data.theater);
        setMovieData(response.data.movie);
      } catch (error) {
        toast.error(`${error}`)
      }
    }
  };

  const handleSeatSelection = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const button = event.currentTarget;
    const isDisabled = button.hasAttribute('disabled');
    const seatCatName = button.dataset.seatcategoryname || '';

    if (!isDisabled) {
      const seatNumber = button.dataset.seatnumber;
      const seatPrice = parseFloat(button.dataset.seatprice || '0');

      const newSelectedSeats = { ...selectedSeats };
      if (!newSelectedSeats[seatCatName]) {
        newSelectedSeats[seatCatName] = [];
      }
      const seatIndex = newSelectedSeats[seatCatName].findIndex((seat: any) => seat.seat === seatNumber);
      if (seatIndex !== -1) {
        newSelectedSeats[seatCatName].splice(seatIndex, 1);
      } else {
        newSelectedSeats[seatCatName].push({ seat: seatNumber, price: seatPrice });
      }
      setSelectedSeats(newSelectedSeats);

      const totalPrice = Object.values(newSelectedSeats).reduce((acc: number, seats: any) => acc + seats.reduce((sum: number, seat: any) => sum + seat.price, 0), 0);
      setTotalPrice(totalPrice);
    } else {
      toast.error('This seat is not available.')
    }
  };

  const handleSeatUnselection = (category: string, seat: string) => {
    const newSelectedSeats = { ...selectedSeats };
    const seatIndex = newSelectedSeats[category].findIndex((s: any) => s.seat === seat);
    if (seatIndex !== -1) {
      newSelectedSeats[category].splice(seatIndex, 1);
      setSelectedSeats(newSelectedSeats);

      const totalPrice = Object.values(newSelectedSeats).reduce((acc: number, seats: any) => acc + seats.reduce((sum: number, seat: any) => sum + seat.price, 0), 0);
      setTotalPrice(totalPrice);
    }
  };

  const handleBookNow = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPaymentPopup(true)
  }; 

  if (!showtimeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-3xl font-bold mb-5 text-center text-gray-800">{movieData.title}</h1>
      <p className="text-center text-sm mb-2">{theaterData.name}, {theaterData.location}, Date & Time: {new Date(showtimeData.time).toLocaleString()}</p>
      
      {/* Theater Screen */}
      <div className="flex justify-center items-center mb-5">
        <img src={screenIcon} alt="Screen Icon" className="w-16 h-16 mr-4" />
      </div>
      
      {/* Seats Layout */}
      {seatCategoryData.map((seatCategory: any) => (
        <div key={seatCategory.id} className="flex flex-col items-center mb-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">{seatCategory.name} - ₹{seatCategory.price}</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {seatCategory.seats.split(',').map((seat: string) => {
              const showtimeSeat = showtimeSeatGroupBySc[seatCategory.id];
              const isAvailable = showtimeSeat && showtimeSeat.seats.split(',').includes(seat);
              const isSelected = selectedSeats[seatCategory.name]?.find((s: any) => s.seat === seat);

              let buttonClass = 'p-2 rounded border ';
              if (isSelected) {
                buttonClass += 'bg-green-500 text-white'; // Selected
              } else if (!isAvailable) {
                buttonClass += 'bg-gray-200 text-gray-800 cursor-not-allowed'; // Sold
              } else {
                buttonClass += 'bg-white text-green-500 hover:bg-green-500 hover:text-white'; // Available
              }

              return (
                <button
                  key={seat}
                  className={`${buttonClass} transition-colors duration-300 ease-in-out`}
                  disabled={!isAvailable}
                  data-showtimeId={showtimeData.id}
                  data-seatNumber={seat}
                  data-seatPrice={seatCategory.price}
                  data-seatcategoryname={seatCategory.name}
                  onClick={handleSeatSelection}
                >
                  {seat}
                </button>
              );
            })}
          </div>
        </div>
      ))}
  
      {/* Legend */}
      <div className="flex justify-center items-center mt-8 mb-4 space-x-4 bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-green-500 font-semibold">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
          <span className="text-gray-800 font-semibold">Sold</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-white bg-green-500 rounded-full px-2 hover:bg-white hover:text-green-500 font-semibold">Selected</span>
        </div>
      </div>
  
      {/* Selected Seats */}
      <div className={`flex justify-center items-center mb-4 flex-col ${Object.values(selectedSeats).flat().length > 0 ? '' : 'hidden'}`}>
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Selected Seats:</h3>
        <div className="flex flex-wrap justify-center">
          {Object.entries(selectedSeats).map(([category, seats]: [string, any], index: number) => (
            <div key={category} className={`flex flex-col items-center mt-4 ${index > 0 ? 'ml-4' : ''}`}>
              <div className={`mb-1 text-sm text-gray-600 ${seats.length > 0 ? '' : 'hidden'}`}>{category} Seats:</div>
              <div className="flex space-x-2">
                {seats.map((seat: any) => (
                  <button
                    key={seat.seat}
                    className="bg-green-500 text-white rounded-full px-3 py-1 mb-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-300"
                    onClick={() => handleSeatUnselection(category, seat.seat)}
                  >
                    {seat.seat}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

  
      {/* Total Price and Book Now Button */}
      <div className="flex justify-center items-center mb-8">
        <div className="bg-white rounded-lg p-6 shadow-lg">
        <p className={`text-lg font-semibold mb-4 text-gray-800 ${Object.values(selectedSeats).flat().length > 0 ? '' : 'hidden'}`}>Total Price: ₹{totalPrice.toFixed(2)}</p>
          <div className="flex items-center justify-center">
            <button
              className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded mr-4 transition-colors duration-300 ease-in-out ${Object.values(selectedSeats).flat().length > 0 ? '' : 'pointer-events-none opacity-50 cursor-not-allowed'}`}
              onClick={handleBookNow}
            >
              Book Now
            </button>
            <Link
              to="/showtimes"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
            >
              Back
            </Link>
          </div>
        </div>
      </div>

      {paymentPopup && (
        <StripeContainer selectedSeats={selectedSeats} showtimeId={showtimeData.id} />
      )}
    </div>
  );
  
};

export default Details;
