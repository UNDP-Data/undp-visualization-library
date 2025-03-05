import { CsvDownloadButton } from '../Actions/CsvDownloadButton';
import { ImageDownloadButton } from '../Actions/ImageDownloadButton';
import { GraphDescription } from '../Typography/GraphDescription';
import { GraphTitle } from '../Typography/GraphTitle';

interface Props {
  graphTitle?: string;
  graphDescription?: string;
  width?: number;
  graphDownload?: HTMLDivElement | null;
  dataDownload?: any;
  isDashboard?: boolean;
}

export function GraphHeader(props: Props) {
  const {
    graphTitle,
    graphDescription,
    width,
    graphDownload,
    dataDownload,
    isDashboard,
  } = props;
  return (
    <div
      className={`flex gap-2 justify-between ${
        graphDescription && graphTitle ? 'items-start' : 'items-center'
      }`}
      style={{
        maxWidth: width ? `${width}px` : 'none',
      }}
      aria-label='Graph header'
    >
      <div className='flex-col flex gap-1'>
        {graphTitle ? (
          <GraphTitle text={graphTitle} isDashboard={isDashboard} />
        ) : null}
        {graphDescription ? <GraphDescription text={graphDescription} /> : null}
      </div>
      {graphDownload || dataDownload ? (
        <div className='flex gap-3'>
          {graphDownload ? (
            <ImageDownloadButton nodeID={graphDownload} buttonSmall />
          ) : null}
          {dataDownload ? (
            <CsvDownloadButton
              csvData={dataDownload}
              buttonSmall
              headers={Object.keys(dataDownload[0]).map(d => ({
                label: d,
                key: d,
              }))}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
