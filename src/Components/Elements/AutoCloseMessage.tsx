import React, { useState, useEffect } from 'react';
import { CircleCheckBig } from '../Icons/Icons';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  message: string;
  duration: number;
  mode: 'dark' | 'light';
}

function AutoCloseMessage(props: Props) {
  const { message, duration, mode } = props;
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
      style={{
        position: 'fixed',
        top: '1rem',
        zIndex: '1000',
        backgroundColor: UNDPColorModule[mode].alerts.lightGreen,
        border: `1px solid ${UNDPColorModule[mode].alerts.darkGreen}`,
        borderRadius: '2px',
        maxWidth: '300px',
        margin: 'auto',
        textAlign: 'center',
        fontFamily:
          'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
      }}
    >
      <CircleCheckBig />
      <p className='undp-viz-typography' style={{ marginBottom: 0 }}>
        {message}
      </p>
    </div>
  );
}

export default AutoCloseMessage;
