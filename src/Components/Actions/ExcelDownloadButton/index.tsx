import { FileDown } from 'lucide-react';
import { exportToExcel } from './excelDownload';

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
  } = props;
  return (
    <button
      type='button'
      className={`undp-button button-${buttonType || 'quaternary'}${
        buttonArrow ? ' button-arrow' : ''
      }`}
      onClick={() =>
        exportToExcel(csvData, fileName || 'data', headers, xlsxHeader, wscols)
      }
    >
      {buttonContent || (
        <FileDown color='black' size={20} strokeWidth={1} absoluteStrokeWidth />
      )}
    </button>
  );
}
