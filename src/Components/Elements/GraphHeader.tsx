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
}

export function GraphHeader(props: Props) {
  const { graphTitle, graphDescription, width, graphDownload, dataDownload } =
    props;

  return (
    <div
      className='flex-div gap-03'
      style={{
        maxWidth: width || 'none',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      <div className='flex-div gap-01' style={{ flexDirection: 'column' }}>
        {graphTitle ? <GraphTitle text={graphTitle} /> : null}
        {graphDescription ? <GraphDescription text={graphDescription} /> : null}
      </div>
      {graphDownload || dataDownload ? (
        <div className='flex-div gap-04'>
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
