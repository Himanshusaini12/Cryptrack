// LoadingSpinner.jsx
import React from 'react';
import { TailSpin } from 'react-loader-spinner';

const LoadingSpinner = () => (
  <div className="loading-spinner">
    <TailSpin color="#00BFFF" height={80} width={80} />
  </div>
);

export default LoadingSpinner;