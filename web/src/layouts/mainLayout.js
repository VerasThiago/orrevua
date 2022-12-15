import Menu from '../components/menu';
import './mainLayout.scss';

export default function MainLayout({ children }) {
  return (
    <div className="row m-0 p-0 min-vh-100 h-100 bg-dark">
      <div className="col-lg-2 p-0 m-0 layout-header">
        <Menu />
      </div>
      <div className="col-lg-10 m-0 p-4 bg-secondary min-vh-100 h-100 layout-container">
        {children}
      </div>
    </div>
  );
}
