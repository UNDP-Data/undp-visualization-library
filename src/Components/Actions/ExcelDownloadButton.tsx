import { excelDownload } from '../../Utils/excelDownload';
import { FileDown } from '../Icons/Icons';

interface WsColInterface {
  wch: number;
}

interface Props {
  buttonContent?: string | JSX.Element;
  buttonType?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  buttonArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any;
  fileName?: string;
  headers: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xlsxHeader: any;
  wscols: WsColInterface[];
  buttonSmall?: boolean;
}

export function ExcelDownloadButton(props: Props) {
  const {
    buttonContent,
    buttonType,
    buttonArrow,
    csvData,
    fileName,
    headers,
    xlsxHeader,
    wscols,
    buttonSmall,
  } = props;
  return (
    <button
      type='button'
      className={`undp-button button-${buttonType || 'quaternary'}${
        buttonArrow ? ' button-arrow' : ''
      }${buttonSmall ? ' padding-03' : ''}`}
      onClick={() =>
        excelDownload(csvData, fileName || 'data', headers, xlsxHeader, wscols)
      }
    >
      {buttonContent || <FileDown />}
    </button>
  );
}
