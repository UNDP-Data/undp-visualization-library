import { message } from 'antd';
import { Copy } from 'lucide-react';
import { styled } from 'styled-components';

interface Props {
  text: string;
  successMessage?: string;
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
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: successMessage || 'Text copied!',
      duration: 5, // change the duration for teh message here in sec
      className: 'undp-message',
    });
  };
  return (
    <>
      {contextHolder}
      <ButtonEl
        type='button'
        className='undp-button'
        onClick={() => {
          navigator.clipboard.writeText(text);
          success();
        }}
      >
        <Copy color='black' size={32} strokeWidth={1} absoluteStrokeWidth />
      </ButtonEl>
    </>
  );
}

export default CopyTextButton;
