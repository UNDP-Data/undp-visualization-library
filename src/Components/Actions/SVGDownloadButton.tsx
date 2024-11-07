import { svgDownload } from '../../Utils/svgDownload';
import { ImageDown } from '../Icons/Icons';

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  buttonArrow?: boolean;
  nodeID: string | HTMLElement;
  filename?: string;
  buttonSmall?: boolean;
  mode?: 'dark' | 'light';
}

export function SVGDownloadButton(props: Props) {
  const {
    nodeID,
    filename,
    buttonContent,
    buttonType,
    buttonArrow,
    buttonSmall,
    mode,
  } = props;
  return (
    <button
      type='button'
      className={`undp-viz-download-button undp-viz-button button-${
        buttonType || 'quaternary'
      }${mode === 'dark' ? ' dark' : ''}${buttonArrow ? ' button-arrow' : ''}`}
      style={{
        padding: buttonSmall ? '0.5rem' : '1rem 1.5rem',
      }}
      onClick={() => {
        if (typeof nodeID === 'string') {
          if (document.getElementById(nodeID)) {
            svgDownload(
              document.getElementById(nodeID) as HTMLElement,
              filename || 'image',
            );
          } else {
            console.error('Cannot find the html element');
          }
        } else {
          svgDownload(nodeID as HTMLElement, filename || 'image');
        }
      }}
      aria-label='Click to download the graph as svg'
    >
      {buttonContent || <ImageDown mode={mode || 'light'} />}
    </button>
  );
}
