import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Load';

const ProtectedRoute = ({ children }) => {
  // Bypassing auth checks for frontend development as requested
  return children;
};

export default ProtectedRoute;
