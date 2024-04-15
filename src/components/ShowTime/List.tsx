import React, { useState, useEffect } from 'react';
import { Tab, Tabs } from '@mui/material';
import ApiService from '../../services/apiService';
import { API_SHOWTIMES } from '../../services/apiEndpoints';
import { CategoriesResponse, Category } from '../../services/types';
import TabPanel from './TabPanel';
import TabContent from './TabContent';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const List: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const movieId = searchParams.get('movie_id');
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [categoriesFetched, setCategoriesFetched] = useState<boolean>(false);

  console.log("List document", document, document.querySelector('[name="csrf-token"]'))

  useEffect(() => {
    if (!categoriesFetched) {
      fetchCategories();
    }
  }, [categoriesFetched]);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.get(API_SHOWTIMES(movieId || '')) as CategoriesResponse;
      setCategories(response.data.categories.data);
      setCategoriesFetched(true);
    } catch (error) {
      toast.error(`${error}`)
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
    setActiveTab(newTab);
  };

  return (
    <div className="container mx-auto px-4 mt-5">
      <h1 className="text-4xl font-bold mb-5 text-center">Showtimes</h1>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
      >
        {categories.map((category, index) => (
          <Tab
            key={category.attributes.id}
            label={category.attributes.name}
            value={index}
            className={`
              py-2 px-4 mr-2 rounded-md
              ${activeTab === index ? 'bg-indigo-500 text-white' : 'text-indigo-500 hover:bg-indigo-100'}
            `}
          />
        ))}
      </Tabs>
      {categories.map((category, index) => (
        <TabPanel key={category.attributes.id} value={activeTab} index={index}>
          <TabContent category={category} movieId={movieId}/>
        </TabPanel>
      ))}
    </div>
  );
};

export default List;
