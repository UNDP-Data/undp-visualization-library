import { message } from 'antd';
import { Copy } from 'lucide-react';
import { styled } from 'styled-components';

interface Props {
  text: string;
  successMessage: string[];
}

const ButtonEl = styled.button`
  background-color: var(--gray-200);
  padding: 'var(--spacing-05)';
  &:hover {
    background-color: var(--gray-400);
  }
`;

function CopyTextButton(props: Props) {
  const { text, successMessage } = props;
  return (
    <ButtonEl
      type='button'
      className='undp-button'
      onClick={() => {
        navigator.clipboard.writeText(text);
        message.success({ content: successMessage, duration: 2 });
      }}
    >
      <Copy color='black' size={32} strokeWidth={1} absoluteStrokeWidth />
    </ButtonEl>
  );
}

export default CopyTextButton;
