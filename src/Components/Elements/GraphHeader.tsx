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
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
}

export function GraphHeader(props: Props) {
  const {
    graphTitle,
    graphDescription,
    width,
    graphDownload,
    dataDownload,
    rtl,
    language,
  } = props;
  return (
    <div
      style={{
        maxWidth: width || 'none',
        justifyContent: 'space-between',
        alignItems: graphDescription && graphTitle ? 'flex-start' : 'center',
        display: 'flex',
        gap: '0.5rem',
        flexDirection: rtl ? 'row-reverse' : 'row',
      }}
    >
      <div style={{ flexDirection: 'column', display: 'flex', gap: '0.125em' }}>
        {graphTitle ? (
          <GraphTitle text={graphTitle} rtl={rtl} language={language} />
        ) : null}
        {graphDescription ? (
          <GraphDescription
            text={graphDescription}
            rtl={rtl}
            language={language}
          />
        ) : null}
      </div>
      {graphDownload || dataDownload ? (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
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
