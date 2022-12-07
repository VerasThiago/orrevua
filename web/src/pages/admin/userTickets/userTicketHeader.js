import { ReactComponent as TrashIcon } from '../../../images/trash.svg';

export default function UserTicketHeader({ user }) {
  return (
    <div className="p-3 d-flex gap-3">
      <div className="py-2 rounded-circle bg-primary p-3" style={{ width: '40px', height: '40px' }}>
        <span>{user.name.split('')[0]}</span>
      </div>
      <div>
        <div>{user.name}</div>
        <div>
          <small>Ingresso individual</small>
        </div>
      </div>
      <div className="ms-auto fs-4">
        <TrashIcon />
      </div>
    </div>
  );
}
