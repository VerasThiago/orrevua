import React, { useEffect, useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import Loading from './loading';

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
        return children ? children : <Outlet />;
      } else {
        return <Navigate to={'/404'} state={{ from: location }} replace />;
      }
    }

    return children ? children : <Outlet />;
  }

  return <Navigate to={'/login'} state={{ from: location }} replace />;
}
