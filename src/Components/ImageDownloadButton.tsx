import { imageDownload } from '../Utils/imageDownload';

interface Props {
  buttonText: string;
  buttonType: 'primary' | 'secondary' | 'tertiary';
  buttonArrow?: boolean;
  node: HTMLElement;
  filename: string;
}

function ImageDownloadButton(props: Props) {
  const { node, filename, buttonText, buttonType, buttonArrow } = props;
  return (
    <button
      type='button'
      className={`undp-button button-${buttonType}${
        buttonArrow ? ' button-arrow' : ''
      }`}
      onClick={() => {
        if (node) {
          imageDownload(node, filename);
        }
      }}
    >
      {buttonText}
    </button>
  );
}

export default ImageDownloadButton;
