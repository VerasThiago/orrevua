import React, { useEffect, useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import Loading from './loading';
import MainLayout from '../layouts/mainLayout';

export default function PrivateRoute({ admin, children }) {
  const { refresh, loading, authenticated, userData } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    refresh();
  }, [location]);

  if (loading) return <Loading />;

  if (authenticated) {
    if (admin) {
      const token = userData();

      if (token.User.isadmin) {
        return children ? <MainLayout>{children}</MainLayout> : <Outlet />;
      } else {
        return <Navigate to={'/404'} state={{ from: location }} replace />;
      }
    }

    return children ? <MainLayout>{children}</MainLayout> : <Outlet />;
  }

  return <Navigate to={'/login'} state={{ from: location }} replace />;
}
