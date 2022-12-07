import { ReactComponent as IconMenu } from '../images/logo.svg';

export default function LeftLoginBar() {
  return (
    <div className="col-lg-6 col-md-12 d-flex flex-column justify-content-center header">
      <div className="row justify-content-center h-50">
        <div className="col-md-8 col-lg-8 d-flex flex-column justify-content-between">
          <div className="d-flex">
            <IconMenu className="me-2" />
            <p className="header-title">orrevuá</p>
          </div>
          <p className="title-login h-50">Seus ingressos na palma da mão</p>
        </div>
      </div>
    </div>
  );
}
