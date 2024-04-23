import React, { useState, useEffect } from 'react';
import ApiService from '../../services/apiService';
import { API_SHOWTIMES } from '../../services/apiEndpoints';
import { ShowTimesResponse, Showtime, Theater, Movie, PriceRange, Screen } from '../../services/types';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

import { format, addDays, subDays, differenceInDays } from 'date-fns';
import ShowTimeCard from './Card';
import Loader from '../../services/Loader';

const List: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const movieId = searchParams.get('movie_id');
  const [movie, setMovie] = useState<Movie>();
  const [showTimes, setShowTimes] = useState<Showtime[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [screens, setScreens] = useState<Screen[]>([]);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedTheater, setSelectedTheater] = useState<any>('');
  const [selectedScreen, setSelectedScreen] = useState<any>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<any>('');
  const [selectedDate, setSelectedDate] = useState<any>(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchCategories()
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const apiUrl = API_SHOWTIMES(movieId || '', selectedDate, selectedPriceRange, selectedTheater, selectedScreen);
      const response = await ApiService.get(apiUrl) as ShowTimesResponse;
      setShowTimes(response.data.showtimes.data);
      setTheaters(response.data.theaters.data);
      setScreens(response.data.screens.data);
      setPriceRanges(response.data.price_ranges);
      setMovie(response.data.movie.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(`${error}`);
    }
  };

  const [startDate, setStartDate] = useState(new Date()); // Initial date
  const [datesArray, setDatesArray] = useState(getDatesArray(startDate));

  // Function to get the last day of the month for a given date
  function getLastDayOfMonth(date:any) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const lastDay = new Date(year, month, 0).getDate(); // This gives the last day of the month
    return new Date(year, month - 1, lastDay); // Return the last date as a Date object
  }

  // Function to generate an array of dates starting from today's date to the last date of the current month
  function getDatesArray(startDate: Date) {
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the current month
    const dates = [];
    let currentDate = startDate;

    // Calculate the remaining dates from the current date to the end of the month
    const remainingDates = differenceInDays(endDate, startDate) + 1;

    // Set the batch size dynamically based on the remaining dates
    const batchSize = remainingDates > 7 ? 7 : remainingDates;

    for (let i = 0; i < batchSize; i++) {
      dates.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return dates;
  }

  // Handler for navigating to previous dates within the current month
  const handlePrevDates = () => {
    const previousStartDate = subDays(startDate, 7); // Calculate the previous start date
    if (previousStartDate.getMonth() === startDate.getMonth()) {
      // Only update the state if the previous start date is within the current month
      setStartDate(previousStartDate);
      setDatesArray(getDatesArray(previousStartDate));
    }
  };

  // Handler for navigating to next dates within the current month
  const handleNextDates = () => {
    const nextStartDate = addDays(startDate, 7); // Calculate the next start date
    if (nextStartDate.getMonth() === startDate.getMonth()) {
      // Only update the state if the next start date is within the current month
      setStartDate(nextStartDate);
      setDatesArray(getDatesArray(nextStartDate));
    }
  };

  // Disable previous button if the current batch starts from today or a future date
  const isPrevDisabled = startDate <= new Date();

  // Disable next button if there are no future dates in the current month
  const isNextDisabled = datesArray.length === 0 || datesArray[datesArray.length - 1] >= getLastDayOfMonth(new Date());

  // Handler for clicking on a date
  const handleDateClick = (date:any) => {
    setSelectedDate(format(date, 'yyyy-MM-dd'));
    // Add your logic for handling the selected date
  };

  const handlePriceRangeChange = (priceRange:any) => {
    console.log('Selected priceRange:', priceRange);
    setSelectedPriceRange(priceRange);
  }

  const handleTheaterChange = (theaterId:any) => {
    console.log('Selected theaterId:', theaterId);
    setSelectedTheater(theaterId);
  }

  const handleScreenChange = (screenId:any) => {
    console.log('Selected screenId:', screenId);
    setSelectedScreen(screenId);
  }

  useEffect(() => {
    fetchCategories()
  }, [selectedDate, selectedPriceRange, selectedTheater, selectedScreen]);

  return (
    <div className="container mx-auto px-4 mt-8">
  
      {/* Movie Name Section */}
      <div className="bg-cover bg-center bg-no-repeat h-96 flex items-center justify-center relative" style={{ backgroundImage: `url(${movie?.attributes.avatar_url})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
        <h1 className="font-bold text-4xl text-white z-10">{movie?.attributes.title}</h1>
      </div>
  
      {/* Filter Section */}
      <div className="bg-gray-100 rounded-lg shadow-md mt-8 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Date Filter (Half Width) */}
          <div className="flex-grow md:flex-grow-0 w-1/2">
            {/* Date Filter */}
            <div className="relative flex-grow w-full">
              <div className="flex items-center space-x-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-blue-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={handlePrevDates}
                  disabled={isPrevDisabled}
                >
                  {'<'}
                </button>
                {datesArray.map((date, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 rounded-lg cursor-pointer ${
                      selectedDate && selectedDate === format(date, 'yyyy-MM-dd')
                        ? 'bg-blue-600 text-white' // Active date
                        : 'bg-gray-300 text-gray-700' // Inactive date
                    } hover:bg-blue-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    onClick={() => handleDateClick(date)}
                  >
                    {format(date, 'EEE, dd MMM')}
                  </button>
                ))}
                <button
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-blue-400 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={handleNextDates}
                  disabled={isNextDisabled}
                >
                  {'>'}
                </button>
              </div>
            </div>
          </div>

          {/* Price Range Filter, Theater Filter, Screen Filter (Half Width) */}
          <div className="flex-grow md:flex-grow-0 w-1/2 flex md:justify-end md:space-x-4 ml-4">
            {/* Price Range Filter */}
            <div className="flex-grow md:flex-grow-0 w-1/3">
              <div className="relative">
                <select
                  id="priceRange"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none
                    bg-white text-black"
                  onChange={(e) => handlePriceRangeChange(e.target.value)}
                  value={selectedPriceRange} // Add value prop to keep the selected value
                >
                  <option value="">Select PriceRange</option>
                  {priceRanges &&
                    priceRanges.map((range) => (
                      <option key={range.value} value={range.value} className={`${selectedPriceRange === range.value ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                        {range.label}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className={`h-5 w-5 fill-current ${
                      selectedPriceRange !== '' ? 'text-white' : 'text-gray-700'
                    }`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Theater Filter */}
            <div className="flex-grow md:flex-grow-0 w-1/3">
              <div className="relative">
                <select
                  id="theater"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none
                    bg-white text-black"
                  onChange={(e) => handleTheaterChange(e.target.value)}
                  value={selectedTheater}
                >
                  <option value="">Select Theater</option>
                  {theaters.map((theater) => (
                    <option key={theater.attributes.id} value={theater.attributes.id} className={`${selectedTheater === theater.attributes.id ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                      {theater.attributes.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className={`h-5 w-5 fill-current ${
                      selectedTheater !== '' ? 'text-white' : 'text-gray-700'
                    }`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Screen Filter */}
            <div className="flex-grow md:flex-grow-0 w-1/3">
              <div className="relative">
                <select
                  id="screen"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 appearance-none
                    bg-white text-black"
                  onChange={(e) => handleScreenChange(e.target.value)}
                  value={selectedScreen}
                >
                  <option value="">Select Screen</option>
                  {screens.map((screen) => (
                    <option key={screen.attributes.id} value={screen.attributes.id} className={`${selectedScreen === screen.attributes.id ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}>
                      {screen.attributes.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg
                    className={`h-5 w-5 fill-current ${
                      selectedScreen !== '' ? 'text-white' : 'text-gray-700'
                    }`}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtime Listing Section */}
      {loading && <Loader />}
      <ShowTimeCard showTimes={showTimes} />
    </div>
  );
};

export default List;
