import { ReactComponent as IconMenu } from '../images/logo.svg';

export default function HomeSidebar() {
  return (
    <div className="d-flex flex-column header h-100 p-2 pt-5 pt-lg-0">
      <div className="d-flex flex-column h-25 justify-content-end">
        <div className="d-flex align-items-center ps-5">
          <IconMenu className="me-2" />
          <p className="header-title">orrevuá</p>
        </div>
      </div>
      <div className="d-flex h-50 flex-column justify-content-center ps-5 mt-4 mt-lg-0">
        <p className="title-login">Seus ingressos na palma da mão</p>
      </div>
    </div>
  );
}
