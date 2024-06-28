import React, { useState, useEffect } from 'react';
import { CircleCheckBig } from '../Icons/Icons';

interface Props {
  message: string;
  duration: number;
}

function AutoCloseMessage(props: Props) {
  const { message, duration } = props;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    // Cleanup the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className='flex-div gap-03 flex-vert-align-center'
      style={{
        position: 'fixed',
        top: '1rem',
        zIndex: '1000',
        backgroundColor: 'var(--light-green)',
        border: '1px solid var(--dark-green)',
        borderRadius: '2px',
        maxWidth: '300px',
        margin: 'auto',
        textAlign: 'center',
        fontFamily: 'var(--fontFamily)',
        padding: 'var(--spacing-03) var(--spacing-04)',
        fontSize: '0.875rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      }}
    >
      <CircleCheckBig />
      <p className='undp-typography margin-bottom-00'>{message}</p>
    </div>
  );
}

export default AutoCloseMessage;
