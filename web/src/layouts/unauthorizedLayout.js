import './mainLayout.scss';
import HomeSidebar from '../components/homeSidebar';

export default function UnauthorizedLayout({ children }) {
  return (
    <div className="row m-0 p-0 vh-100 bg-dark">
      <div className="col-lg-6 m-0 p-0">
        <HomeSidebar />
      </div>
      <div className="col-lg-6 m-0 px-4 h-100 bg-secondary layout-container">{children}</div>
    </div>
  );
}
