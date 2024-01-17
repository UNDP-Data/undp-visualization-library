import { exportToExcel } from '../Utils/excelDownload';

interface WsColInterface {
  wch: number;
}

interface Props {
  buttonText: string;
  buttonType: 'primary' | 'secondary' | 'tertiary';
  buttonArrow?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any;
  indicatorTitle: string;
  header: string[];
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
    indicatorTitle,
    header,
    xlsxHeader,
    wscols,
  } = props;
  return (
    <button
      type='button'
      className={`undp-button button-${buttonType}${
        buttonArrow ? ' button-arrow' : ''
      }`}
      onClick={() =>
        exportToExcel(csvData, indicatorTitle, header, xlsxHeader, wscols)
      }
    >
      {buttonText}
    </button>
  );
}

export default ExcelDownloadButton;
