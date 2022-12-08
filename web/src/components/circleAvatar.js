export default function UserTicketHeader({ userName }) {
  return (
    <div className="py-2 rounded-circle bg-primary p-3" style={{ width: '40px', height: '40px' }}>
      <span>{userName.split('')[0].toUpperCase()}</span>
    </div>
  );
}
