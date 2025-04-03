import { Button } from '@undp-data/undp-design-system-react';
import { imageDownload } from '@/Utils/imageDownload';
import { ImageDown } from '@/Components/Icons';

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?:
    | 'primary'
    | 'primary-without-icon'
    | 'secondary'
    | 'secondary-without-icon'
    | 'tertiary';
  nodeID: string | HTMLElement;
  filename?: string;
  buttonSmall?: boolean;
  className?: string;
}

export function ImageDownloadButton(props: Props) {
  const {
    nodeID,
    filename = 'image',
    buttonContent,
    buttonType = 'tertiary',
    buttonSmall,
    className = '',
  } = props;
  return (
    <Button
      variant={buttonType}
      className={`${
        buttonSmall ? 'p-2' : 'py-4 px-6'
      } ${className} border border-primary-gray-400 dark:border-primary-gray-550`}
      onClick={() => {
        if (typeof nodeID === 'string') {
          if (document.getElementById(nodeID)) {
            imageDownload(
              document.getElementById(nodeID) as HTMLElement,
              filename,
            );
          } else {
            console.error('Cannot find the html element');
          }
        } else {
          imageDownload(nodeID as HTMLElement, filename);
        }
      }}
      aria-label='Click to download the graph as image'
    >
      {buttonContent || <ImageDown />}
    </Button>
  );
}
