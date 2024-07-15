import { useState } from 'react';
import { Copy } from '../Icons/Icons';
import AutoCloseMessage from '../Elements/AutoCloseMessage';

interface Props {
  text: string;
  successMessage?: string;
  buttonText?: string;
}

export function CopyTextButton(props: Props) {
  const { text, successMessage, buttonText } = props;
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <>
      <button
        type='button'
        className='undp-button button-quaternary padding-05 flex-div gap-03 flex-vert-align-center'
        onClick={() => {
          navigator.clipboard.writeText(text);
          handleShowMessage();
        }}
      >
        <Copy />
        {buttonText ? (
          <p
            className='undp-typography margin-bottom-00 small-font'
            style={{ color: 'var(--gray-700)', textTransform: 'uppercase' }}
          >
            {buttonText}
          </p>
        ) : null}
      </button>
      {showMessage && (
        <AutoCloseMessage
          message={successMessage || 'Text copied'}
          duration={2000}
        />
      )}
    </>
  );
}
