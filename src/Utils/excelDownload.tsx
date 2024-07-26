import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

interface WsColInterface {
  wch: number;
}

export const excelDownload = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any,
  fileName: string,
  headers: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xlsxHeader: any,
  wscols: WsColInterface[],
) => {
  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const ws = XLSX.utils.json_to_sheet([xlsxHeader], {
    header: headers,
    skipHeader: true,
  });

  ws['!cols'] = wscols;
  XLSX.utils.sheet_add_json(ws, csvData, {
    header: headers,
    skipHeader: true,
    origin: -1,
  });
  const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const dataForExcel = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(dataForExcel, `${fileName}.xlsx`);
};
