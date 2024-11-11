import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from './utilis/UserContext';
import axiosInstance from './utilis/axiosInstance';

const QuoteCreation = () => {
  const [quoteText, setQuoteText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const { token } = useUserContext();

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const imageUploadResponse = await axiosInstance.post(
        'https://crafto.app/crafto/v1.0/media/assignment/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const uploadedImageUrl = imageUploadResponse?.data[0]?.url;
      setImageUrl(uploadedImageUrl);

      const createQuoteResponse = await axiosInstance.post('postQuote', {
        text: quoteText,
        mediaUrl: uploadedImageUrl,
      });

      if (createQuoteResponse.status === 200) {
        setModalMessage('Quote created successfully!');
        setModalVisible(true);
      } else {
        setModalMessage('Failed to create quote.');
        setModalVisible(true);
      }
    } catch (err) {
      console.error('Error during submission:', err);
      setModalMessage('An error occurred while creating the quote.');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };
  const handleModalClose = () => {
    setModalVisible(false);
    navigate('/quote-list');
  };
  return (
    <div className='py-4 mx-20'>
      <button
        onClick={handleBack}
        className='bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600 focus:outline-none mb-4'
      >
        Back
      </button>
      <h2 className='text-2xl font-semibold mb-4'>Create a New Quote</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-gray-700'>Quote Text</label>
          <textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            rows='4'
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            placeholder='Enter your quote here...'
            required
          />
        </div>

        <div>
          <label className='block text-gray-700'>Upload an Image</label>
          <input
            type='file'
            onChange={handleImageChange}
            className='w-full text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
            accept='image/*'
            required
          />
        </div>

        {imageFile && (
          <div className='mt-4'>
            <img
              src={URL.createObjectURL(imageFile)}
              alt='Preview'
              className='w-40 h-40 object-cover rounded-md'
            />
          </div>
        )}
        <div>
          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none'
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Create Quote'}
          </button>
        </div>
      </form>
      {modalVisible && (
        <div className='fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg max-w-xs text-center'>
            <p className='text-lg font-semibold text-gray-700 mb-4'>
              {modalMessage}
            </p>
            <button
              onClick={handleModalClose}
              className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none'
            >
              ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuoteCreation;
