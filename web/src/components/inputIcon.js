import React from 'react';

export default function InputIcon({ icon, iconProps = {}, ...originalProps }) {
  const updatedIcon = React.cloneElement(icon, {
    ...iconProps,
    style: { ...iconProps.style, position: 'absolute', right: '1.5rem', bottom: '1.15rem' }
  });

  return (
    <div style={{ position: 'relative' }}>
      <input {...originalProps} />
      {updatedIcon}
    </div>
  );
}
