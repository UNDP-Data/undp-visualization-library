import { useState } from 'react';
import { Copy } from '../Icons/Icons';
import AutoCloseMessage from '../Elements/AutoCloseMessage';

interface Props {
  text: string;
  successMessage?: string;
}

export function CopyTextButton(props: Props) {
  const { text, successMessage } = props;
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  return (
    <>
      <button
        type='button'
        className='undp-button button-quaternary padding-05'
        onClick={() => {
          navigator.clipboard.writeText(text);
          handleShowMessage();
        }}
      >
        <Copy />
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
