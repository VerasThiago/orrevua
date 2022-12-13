import './unauthorizedLayout.scss';
import HomeSidebar from '../components/homeSidebar';

export default function UnauthorizedLayout({ children }) {
  return (
    <div className="row m-0 p-0 vh-100">
      <div className="col-lg-6 m-0 p-0 mb-5 mb-lg-0">
        <HomeSidebar />
      </div>
      <div className="col-lg-6 m-0 px-4 bg-secondary unauthorized-layout-container">{children}</div>
    </div>
  );
}
