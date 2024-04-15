import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faTimes, faReceipt } from '@fortawesome/free-solid-svg-icons';
import { Booking } from '../../services/types';
import ApiService from '../../services/apiService';
import { API_CANCEL_BOOKING } from '../../services/apiEndpoints';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Props {
  booking: Booking;
  category: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  fetchData: any;
}

interface SeatCategory {
  [key: string]: string[];
}

const Details: React.FC<Props> = ({ booking, category, setActiveTab, fetchData }) => {
  const { showtime, booked_seats, id: bookingId, showtime_id: showtimeId } = booking.attributes;
  const { movie, theater } = showtime.data.attributes;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleCancelBooking = async () => {
    setShowModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await ApiService.get(API_CANCEL_BOOKING(bookingId));
      fetchData();
      setActiveTab('cancelled_bookings');
    } catch (error) {
      toast.error(`${error}`);
    }
    setShowModal(false);
  };

  const handleViewInvoice = async () => {
    navigate(`/bookings/${bookingId}/invoice?showtime_id=${showtimeId}`);
  };

  const seatsByCategory: SeatCategory = booked_seats.data.reduce((acc: SeatCategory, seat) => {
    const category = seat.attributes.seat_category.data.attributes.name;
    const seats = seat.attributes.seats;

    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(seats);
    return acc;
  }, {});

  return (
    <div className="card bg-gray-100 p-4 rounded-lg shadow-lg flex flex-col h-auto w-full">
      {movie.data.attributes.avatar_url && (
        <img
          src={movie.data.attributes.avatar_url}
          className="rounded-lg object-cover w-full h-64 mb-4"
          alt="Movie Poster"
        />
      )}
      <div className="flex-grow">
        <h2 className="text-3xl font-bold mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap">{movie.data.attributes.title}</h2>
        <p className="text-lg mb-2">{new Date(showtime.data.attributes.time).toLocaleString()}</p>
        <p className="text-lg mb-2">Theater: {theater.data.attributes.name}</p>
        <p className="text-lg mb-2">Location: {theater.data.attributes.location}</p>
        {Object.entries(seatsByCategory).map(([category, seats]) => (
          <div key={category} className="mb-2">
            <strong>{category}:</strong> {seats.join(', ')}
          </div>
        ))}
      </div>
      <div className="flex justify-start">
        {/* Buttons */}
        <button
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out mr-2"
          onClick={() =>
            navigate(
              `/showtimes/${showtime.data.attributes.id}?theater_id=${showtime.data.attributes.theater_id}&screen_id=${showtime.data.attributes.screen_id}&movie_id=${showtime.data.attributes.movie_id}`
            )
          }
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          View
        </button>
        {category === 'my_bookings' && (
          <>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out mr-2"
              onClick={() => handleCancelBooking()}
            >
              <FontAwesomeIcon icon={faTimes} className="mr-2" />
              Cancel
            </button>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
              onClick={() => handleViewInvoice()}
            >
              <FontAwesomeIcon icon={faReceipt} className="mr-2" />
              Invoice
            </button>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p className="mb-4">Are you sure you want to cancel this booking?</p>
            <div className="modal-buttons">
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                onClick={confirmCancelBooking}
              >
                Confirm
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
