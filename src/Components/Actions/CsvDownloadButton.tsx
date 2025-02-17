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
  mode: 'dark' | 'light';
}

const transformDataForCsv = (data: any) => {
  if (!data) return {};
  return data.map((obj: any) => {
    const newObj = { ...obj };

    Object.entries(newObj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        newObj[key] = `${value.join(',')}`;
      }
      if (typeof value === 'string') {
        newObj[key] = `${value.replaceAll('"', "'")}`;
      }
    });

    return newObj;
  });
};
export function CsvDownloadButton(props: Props) {
  const {
    buttonContent,
    buttonType = 'quaternary',
    buttonArrow = false,
    csvData,
    fileName = 'data',
    headers,
    separator = ',',
    buttonSmall = false,
    mode = 'light',
  } = props;
  return (
    <CSVLink
      headers={headers}
      enclosingCharacter='"'
      separator={separator}
      data={transformDataForCsv(csvData)}
      filename={`${fileName}.csv`}
      asyncOnClick
      target='_blank'
      style={{ backgroundImage: 'none', textDecoration: 'none' }}
      aria-label='Click to download the data as csv'
    >
      <div
        className={`undp-viz-download-button undp-viz-button button-${buttonType}${
          mode === 'dark' ? ' dark' : ''
        }${buttonArrow ? ' button-arrow' : ''}`}
        style={{
          textDecoration: 'none',
          padding: buttonSmall ? '0.5rem' : '1rem 1.5rem',
        }}
      >
        {buttonContent || <FileDown mode={mode} />}
      </div>
    </CSVLink>
  );
}
