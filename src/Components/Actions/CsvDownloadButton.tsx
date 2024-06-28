import { CSVLink } from 'react-csv';
import { FileDown } from 'lucide-react';

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
        className={`undp-button button-${buttonType || 'quaternary'}${
          buttonArrow ? ' button-arrow' : ''
        }`}
        style={{
          textDecoration: 'none',
        }}
      >
        {buttonContent || (
          <FileDown
            color='black'
            size={20}
            strokeWidth={1}
            absoluteStrokeWidth
          />
        )}
      </div>
    </CSVLink>
  );
}
