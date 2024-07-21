import { ImageDown } from '../../Icons/Icons';
import { imageDownload } from './imageDownload';

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  buttonArrow?: boolean;
  nodeID: string | HTMLElement;
  filename?: string;
  buttonSmall?: boolean;
}

export function ImageDownloadButton(props: Props) {
  const {
    nodeID,
    filename,
    buttonContent,
    buttonType,
    buttonArrow,
    buttonSmall,
  } = props;
  return (
    <button
      type='button'
      className={`undp-button button-${buttonType || 'quaternary'}${
        buttonArrow ? ' button-arrow' : ''
      }${buttonSmall ? ' padding-03' : ''}`}
      onClick={() => {
        if (typeof nodeID === 'string') {
          if (document.getElementById(nodeID)) {
            imageDownload(
              document.getElementById(nodeID) as HTMLElement,
              filename || 'image',
            );
          } else {
            // eslint-disable-next-line no-console
            console.error('Cannot find the html element');
          }
        } else {
          imageDownload(nodeID as HTMLElement, filename || 'image');
        }
      }}
    >
      {buttonContent || <ImageDown />}
    </button>
  );
}
