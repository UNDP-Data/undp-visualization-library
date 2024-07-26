import { svgDownload } from '../../Utils/svgDownload';
import { ImageDown } from '../Icons/Icons';

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  buttonArrow?: boolean;
  nodeID: string | HTMLElement;
  filename?: string;
  buttonSmall?: boolean;
}

export function SVGDownloadButton(props: Props) {
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
            svgDownload(
              document.getElementById(nodeID) as HTMLElement,
              filename || 'image',
            );
          } else {
            // eslint-disable-next-line no-console
            console.error('Cannot find the html element');
          }
        } else {
          svgDownload(nodeID as HTMLElement, filename || 'image');
        }
      }}
    >
      {buttonContent || <ImageDown />}
    </button>
  );
}
