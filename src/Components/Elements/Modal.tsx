/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  rtl?: boolean;
  children: ReactNode;
}

export function Modal(props: Props) {
  const { isOpen, onClose, rtl, children } = props;
  if (!isOpen) return null;

  return (
    <div
      className={`undp-viz-modal-overlay${rtl ? ' undp-viz-modal-rtl' : ''}`}
      onClick={onClose}
    >
      <div
        className='undp-viz-modal-content'
        onClick={e => e.stopPropagation()}
      >
        <button
          type='button'
          className='undp-viz-modal-close'
          onClick={onClose}
          aria-label='close button'
        />
        {children}
      </div>
    </div>
  );
}
