import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';
import { ReactComponent as IconMenu } from '../../images/logo.svg';
import './index.scss';

export default function Home() {
  const { authenticated } = useContext(AuthContext);
  const location = useLocation();

  if (authenticated) return <Navigate to={'/tickets'} state={{ from: location }} replace />;

  return (
    <div className="landing-page vh-100">
      <div className="d-flex justify-content-center align-items-end h-25 mb-5">
        <IconMenu height="3.5em" className="m-2" />
        <span className="text-white logo">orrevuá</span>
      </div>
      <div className="d-flex flex-column align-items-center justify-content-center mb-5 h-25">
        <p className="fs-1 fw-bold text-white">Despedida do Veras</p>
        <p className="fs-3 text-white-50 fw-lighter mb-0">23 de Dezembro de 2022 às 20h</p>
        <p className="fs-3 text-white-50 fw-lighter mb-0">Espaço Mocambo</p>
      </div>
      <div className="d-flex justify-content-center">
        <span className="text-white fs-3 badge rounded-pill text-bg-primary py-4 px-5 text-uppercase">
          Novidades em breve
        </span>
      </div>
    </div>
  );
}
