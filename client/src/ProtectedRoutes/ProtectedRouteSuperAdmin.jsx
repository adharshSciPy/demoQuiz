import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
const  ProtectedRouteSuperAdmin=({element})=> {
    const { isLoggedIn, isSuperAdmin } = useAuth();
      if (!isLoggedIn || !isSuperAdmin) {
        // Redirect to landing page or login if not authenticated or not an admin
        return <Navigate to="/" replace />;
      }
    
      // If the user is authenticated and has ADMIN_ROLE, render the child component
      return element;
}

export default ProtectedRouteSuperAdmin
