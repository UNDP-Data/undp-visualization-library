import { imageDownload } from './imageDownload';

interface Props {
  buttonText?: string;
  buttonType?: 'primary' | 'secondary' | 'tertiary';
  buttonArrow?: boolean;
  nodeID: string;
  filename?: string;
}

function ImageDownloadButton(props: Props) {
  const { nodeID, filename, buttonText, buttonType, buttonArrow } = props;
  return (
    <button
      type='button'
      className={`undp-button button-${buttonType || 'primary'}${
        buttonArrow ? ' button-arrow' : ''
      }`}
      onClick={() => {
        if (document.getElementById(nodeID)) {
          imageDownload(
            document.getElementById(nodeID) as HTMLElement,
            filename || 'image',
          );
        } else {
          // eslint-disable-next-line no-console
          console.error('Cannot find the html element');
        }
      }}
    >
      {buttonText || 'Download Div'}
    </button>
  );
}

export default ImageDownloadButton;
