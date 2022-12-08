import Menu from '../components/menu';

export default function MainLayout({ children }) {
  return (
    <div className="row m-0 p-0 vh-100">
      <div className="col-lg-2 p-0 m-0">
        <Menu />
      </div>
      <div className="col-lg-10 m-0 p-4">{children}</div>
    </div>
  );
}
