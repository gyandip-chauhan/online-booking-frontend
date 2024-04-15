import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import BookingDetails from './Details';
import { Booking } from '../../services/types';
import ApiService from '../../services/apiService';
import { API_BOOKINGS } from '../../services/apiEndpoints';
import { toast } from 'react-toastify';

const List: React.FC = () => {
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [cancelBookings, setCancelBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('my_bookings');

  useEffect(() => {
    fetchData();
  }, []);
    
  const fetchData = async () => {
    try {
      const response = await ApiService.get(API_BOOKINGS);
      const { my_bookings, cancel_bookings, categories } = response.data;
      setMyBookings(my_bookings.data);
      setCancelBookings(cancel_bookings.data);
      setCategories(categories);
    } catch (error) {
      toast.error(`${error}`)
    }
  };

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <div className="container mx-auto px-4 mt-5">
      {/* <h1 className="mb-4">Bookings</h1> */}

      {/* Material-UI Tabs */}
      <Tabs value={activeTab} onChange={handleTabChange} aria-label="My Bookings Tabs" className="border-b border-gray-200">
        {categories.map((category) => (
          <Tab key={category} label={category.replace('_', ' ').toUpperCase()} value={category} className="text-gray-700" />
        ))}
      </Tabs>

      {/* Tab panes */}
      <div className="mt-3">
        {categories.map((category) => (
          <div key={category} role="tabpanel" hidden={category !== activeTab}>
            {category === 'my_bookings' && myBookings.length === 0 ? (
              <div className="py-4 text-gray-600">No bookings available.</div>
            ) : category === 'cancelled_bookings' && cancelBookings.length === 0 ? (
              <div className="py-4 text-gray-600">No cancel bookings available.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {category === 'my_bookings'
                  ? myBookings.map((booking) => (
                      <div key={booking.attributes.id}>
                        <BookingDetails booking={booking} category={category} setActiveTab={setActiveTab} fetchData={fetchData} />
                      </div>
                    ))
                  : cancelBookings.map((booking) => (
                      <div key={booking.attributes.id}>
                        <BookingDetails booking={booking} category={category} setActiveTab={setActiveTab} fetchData={fetchData} />
                      </div>
                    ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
