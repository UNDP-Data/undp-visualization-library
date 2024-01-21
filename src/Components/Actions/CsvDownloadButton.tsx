import { CSVLink } from 'react-csv';

interface HeaderProps {
  label: string;
  key: string;
}

interface Props {
  buttonText: string;
  buttonType: 'primary' | 'secondary' | 'tertiary';
  buttonArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any;
  fileName: string;
  headers: HeaderProps[];
}

function CsvDownloadButton(props: Props) {
  const { buttonText, buttonType, buttonArrow, csvData, fileName, headers } =
    props;
  return (
    <CSVLink
      headers={headers}
      enclosingCharacter=''
      separator=';'
      data={csvData}
      filename={`${fileName}.csv`}
      asyncOnClick
      target='_blank'
      style={{ backgroundImage: 'none' }}
    >
      <div
        className={`undp-button button-${buttonType}${
          buttonArrow ? ' button-arrow' : ''
        }`}
      >
        {buttonText}
      </div>
    </CSVLink>
  );
}

export default CsvDownloadButton;
