import React, { useEffect, useState } from 'react';
import { useUserContext } from './utilis/UserContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from './utilis/axiosInstance';
import InfiniteScroll from 'react-infinite-scroll-component';

const QuoteList = () => {
  const { loggedInUser, token } = useUserContext();
  const [quoteList, setQuoteList] = useState([]);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, [offset]);

  const fetchData = async () => {
    if (!token) return;

    try {
      const response = await axiosInstance.get(
        `/getQuotes?limit=${limit}&offset=${offset}`
      );
      if (response?.data?.data && response.data.data.length > 0) {
        setQuoteList((prevList) => [...prevList, ...response.data.data]);
      } else {
        setHasMore(false);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data: ', err);
      setLoading(false);
    }
  };

  const handleCreateQuote = () => {
    navigate('/create-quote');
  };
  const scrollToPreviousPosition = () => {
    const scrollPosition = window.scrollY;

    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 300);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='quote-list'>
      {quoteList?.length === 0 ? (
        <div>No quotes available</div>
      ) : (
        <InfiniteScroll
          dataLength={quoteList?.length}
          next={() => {
            setOffset((prevOffset) => prevOffset + 20);
            setLoading(true);
            scrollToPreviousPosition();
          }}
          hasMore={hasMore}
          loader={<div>Loading...</div>}
          endMessage={<div>No more quotes to load</div>}
          scrollThreshold={0.95}
          scrollableTarget='quote-list'
        >
          <ul className='flex flex-wrap justify-center gap-4 p-4 '>
            {quoteList.map((quote) => (
              <li
                key={quote.id}
                className='w-80 bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105'
              >
                <div className='relative'>
                  <img
                    src={quote.mediaUrl}
                    alt={quote.text}
                    className='w-full h-48 object-cover rounded-t-lg'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 rounded-t-lg'></div>
                  <div className='absolute bottom-4 left-4 right-4 text-white font-semibold text-lg'>
                    {quote.text}
                  </div>
                </div>

                <div className='p-4'>
                  <div className='text-sm text-gray-500'>
                    Username:{' '}
                    <span className='font-medium text-gray-900'>
                      {quote.username}
                    </span>
                  </div>
                  <div className='text-sm text-gray-500'>
                    Created At:{' '}
                    <span className='font-medium text-gray-900'>
                      {quote.createdAt}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </InfiniteScroll>
      )}
      <button
        onClick={handleCreateQuote}
        className='fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none'
      >
        <span className='text-2xl'>+</span>
      </button>
    </div>
  );
};

export default QuoteList;
