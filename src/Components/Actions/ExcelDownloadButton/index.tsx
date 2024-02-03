import { exportToExcel } from './excelDownload';

interface WsColInterface {
  wch: number;
}

interface Props {
  buttonText?: string;
  buttonType?: 'primary' | 'secondary' | 'tertiary';
  buttonArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any;
  fileName?: string;
  headers: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xlsxHeader: any;
  wscols: WsColInterface[];
}

function ExcelDownloadButton(props: Props) {
  const {
    buttonText,
    buttonType,
    buttonArrow,
    csvData,
    fileName,
    headers,
    xlsxHeader,
    wscols,
  } = props;
  return (
    <button
      type='button'
      className={`undp-button button-${buttonType || 'primary'}${
        buttonArrow ? ' button-arrow' : ''
      }`}
      onClick={() =>
        exportToExcel(csvData, fileName || 'data', headers, xlsxHeader, wscols)
      }
    >
      {buttonText || 'Download Excel'}
    </button>
  );
}

export default ExcelDownloadButton;
