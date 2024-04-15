import React from 'react';
import { Category } from '../../services/types';
import TheaterContainer from './TheaterContainer';

interface TabContentProps {
  category: Category;
  movieId: any;
}

const TabContent: React.FC<TabContentProps> = ({ category, movieId }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      {category.attributes.showtimes.data.length > 0 ? (
        <TheaterContainer showtimes={category.attributes.showtimes.data} movieId={movieId} />
      ) : (
        <p className="text-gray-500">No showtimes available</p>
      )}
    </div>
  );
};

export default TabContent;
