import CircleAvatar from '../components/circleAvatar';

export default function Header({ title, subTitle, user }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-5">
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
