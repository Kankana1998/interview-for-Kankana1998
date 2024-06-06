import React from 'react';
import loadImage from '../assets/loading.jpg';

const Shimmer = () => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <img src={loadImage} alt="Loading" className="mt-3 w-52 h-44" />
    </div>
  );
}

export default Shimmer;
