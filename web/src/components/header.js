import { useContext } from 'react';
import CircleAvatar from '../components/circleAvatar';
import { AuthContext } from '../App';

export default function Header({ title, subTitle }) {
  const { userData } = useContext(AuthContext);
  const user = userData().User;

  return (
    <div className="d-flex justify-content-between align-items-center mb-5 layout-header">
      <div>
        <div className="fs-2 fw-bold">{title}</div>
        {subTitle && <div>{subTitle}</div>}
      </div>
      <div className="row align-items-center">
        <div className="col-2">
          <CircleAvatar userName={user.name} />
        </div>
        <div className="col-10">
          <div>{user.name}</div>
          <div className="text-muted">{user.email}</div>
        </div>
      </div>
    </div>
  );
}
