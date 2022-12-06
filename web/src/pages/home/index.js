import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';

export default function Home() {
  const { authenticated } = useContext(AuthContext);
  const location = useLocation();

  if (authenticated) return <Navigate to={'/tickets'} state={{ from: location }} replace />;
  else return <Navigate to={'/login'} state={{ from: location }} replace />;
}
