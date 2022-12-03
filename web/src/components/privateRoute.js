import React, { useEffect, useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import Loading from './loading';

export default function PrivateRoute({ children }) {
  const { refresh, loading, authenticated } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    refresh();
  }, [location]);

  if (loading) return <Loading />;
  if (authenticated) return children ? children : <Outlet />;
  return <Navigate to={'/login'} state={{ from: location }} replace />;
}
