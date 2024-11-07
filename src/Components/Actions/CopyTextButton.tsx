import { useState } from 'react';
import { Copy } from '../Icons/Icons';
import AutoCloseMessage from '../Elements/AutoCloseMessage';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
  successMessage?: string;
  buttonText?: string;
  buttonSmall?: boolean;
  mode: 'dark' | 'light';
}

export function CopyTextButton(props: Props) {
  const { text, successMessage, buttonText, buttonSmall, mode } = props;
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <>
      <button
        type='button'
        className={`undp-viz-button button-quaternary${
          mode === 'dark' ? ' dark' : ''
        }`}
        style={{
          display: 'flex',
          padding: buttonSmall ? '0.5rem' : '1rem',
          gap: '0.5rem',
          alignItems: 'center',
        }}
        onClick={() => {
          navigator.clipboard.writeText(text);
          handleShowMessage();
        }}
        aria-label='Click to copy the text'
      >
        <Copy mode={mode} />
        {buttonText ? (
          <p
            className='undp-viz-typography'
            style={{
              color: UNDPColorModule[mode || 'light'].grays['gray-700'],
              textTransform: 'uppercase',
              marginBottom: 0,
              fontSize: '0.875rem',
            }}
          >
            {buttonText}
          </p>
        ) : null}
      </button>
      {showMessage && (
        <AutoCloseMessage
          message={successMessage || 'Text copied'}
          duration={2000}
          mode={mode}
        />
      )}
    </>
  );
}
