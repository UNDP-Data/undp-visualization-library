import { CSVLink } from 'react-csv';
import { FileDown } from '../Icons/Icons';

interface HeaderProps {
  label: string;
  key: string;
}

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  buttonArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any;
  fileName?: string;
  headers: HeaderProps[];
  separator?: ',' | ';';
  buttonSmall?: boolean;
}

export function CsvDownloadButton(props: Props) {
  const {
    buttonContent,
    buttonType,
    buttonArrow,
    csvData,
    fileName,
    headers,
    separator,
    buttonSmall,
  } = props;
  return (
    <CSVLink
      headers={headers}
      enclosingCharacter=''
      separator={separator || ','}
      data={csvData}
      filename={`${fileName || 'data'}.csv`}
      asyncOnClick
      target='_blank'
      style={{ backgroundImage: 'none', textDecoration: 'none' }}
    >
      <div
        className={`undp-viz-download-button undp-viz-button button-${
          buttonType || 'quaternary'
        }${buttonArrow ? ' button-arrow' : ''}`}
        style={{
          textDecoration: 'none',
          padding: buttonSmall ? '0.5rem' : '1rem 1.5rem',
        }}
      >
        {buttonContent || <FileDown />}
      </div>
    </CSVLink>
  );
}
