import { CSVLink } from 'react-csv';

interface HeaderProps {
  label: string;
  key: string;
}

interface Props {
  buttonText?: string;
  buttonType?: 'primary' | 'secondary' | 'tertiary';
  buttonArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any;
  fileName?: string;
  headers: HeaderProps[];
  separator?: ',' | ';';
}

function CsvDownloadButton(props: Props) {
  const {
    buttonText,
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
        className={`undp-button button-${buttonType || 'primary'}${
          buttonArrow ? ' button-arrow' : ''
        }`}
        style={{
          textDecoration: 'none',
        }}
      >
        {buttonText || 'Download CSV'}
      </div>
    </CSVLink>
  );
}

export default CsvDownloadButton;
