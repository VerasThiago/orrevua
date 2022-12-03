import { Spin } from 'antd';

export default function Loading() {
  return (
    <div
      style={{
        minWidth: '100%',
        minHeight: '100%',
        textAlign: 'center',
        lineHeight: '40rem'
      }}>
      <Spin size="large" />
    </div>
  );
}
