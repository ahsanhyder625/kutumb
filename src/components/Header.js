import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from './utilis/UserContext';

const Header = () => {
  const [btnName, setBtnName] = useState('Login');
  const { loggedInUser, logout } = useUserContext();

  const handleLogout = () => {
    logout();
    setBtnName('Login');
  };

  return (
    <div className='flex m-0.5 p-3.5 justify-between z-10 bg-white shadow-lg sticky top-0'>
      <div className=''>
        <img
          src='https://kutumb.app/public/images/main/k-logo.svg'
          alt='appLogo'
          className='w-15 h-10'
        />
      </div>
      <div className='flex items-center'>
        <ul className='flex'>
          <li className='px-4 font-semibold'>
            {loggedInUser ? (
              <button className='text-blue-500' onClick={handleLogout}>
                Logout <i className='fa-regular fa-user'></i>
              </button>
            ) : (
              <Link to='/' className='text-blue-500'>
                Login <i className='fa-regular fa-user'></i>
              </Link>
            )}
          </li>

          {loggedInUser && <li className='px-1 font-bold'>{loggedInUser}</li>}
        </ul>
      </div>
    </div>
  );
};

export default Header;
