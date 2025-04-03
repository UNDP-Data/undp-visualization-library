/* eslint-disable no-console */
import Papa from 'papaparse';
import Handlebars from 'handlebars';
import { ColumnConfigurationDataType, FileSettingsDataType } from '@/Types';
import { transformColumnsToArray } from './transformData/transformColumnsToArray';
import { mergeMultipleData } from './transformData/mergeMultipleData';

function reFormatData(data: any, dataTransformation?: string) {
  if (!dataTransformation) return data;
  Handlebars.registerHelper(
    'json',
    context => new Handlebars.SafeString(JSON.stringify(context, null, 2)),
  );
  const template = Handlebars.compile(dataTransformation);
  return JSON.parse(template(data));
}

export async function fetchAndParseCSV(
  dataURL: string,
  dataTransformation?: string,
  columnsToArray?: ColumnConfigurationDataType[],
  debugMode?: boolean,
  delimiter?: string,
  header?: boolean,
) {
  return new Promise((resolve, reject) => {
    Papa.parse(dataURL, {
      download: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      header: header !== false,
      delimiter: delimiter || ',',
      complete(results) {
        if (debugMode) {
          console.log('Data from file:', results.data);
        }
        if (columnsToArray) {
          const transformedData = transformColumnsToArray(
            results.data,
            columnsToArray,
          );
          if (debugMode) {
            console.log(
              'Data after transformation of column to array:',
              transformedData,
            );
          }
          resolve(reFormatData(transformedData, dataTransformation));
        } else resolve(reFormatData(results.data, dataTransformation));
      },
      error(error: any) {
        reject(error);
      },
    });
  });
}

export async function fetchAndParseCSVFromTextBlob(
  data: string,
  dataTransformation?: string,
  columnsToArray?: ColumnConfigurationDataType[],
  debugMode?: boolean,
  delimiter?: string,
  header?: boolean,
) {
  return new Promise((resolve, reject) => {
    Papa.parse(data, {
      skipEmptyLines: true,
      header: header !== false,
      delimiter: delimiter || ',',
      complete(results) {
        if (debugMode) {
          console.log('Data from file:', results.data);
        }
        if (columnsToArray) {
          const transformedData = transformColumnsToArray(
            results.data,
            columnsToArray,
          );
          if (debugMode) {
            console.log(
              'Data after transformation of column to array:',
              transformedData,
            );
          }
          resolve(reFormatData(transformedData, dataTransformation));
        } else resolve(reFormatData(results.data, dataTransformation));
      },
      error(error: any) {
        reject(error);
      },
    });
  });
}

export async function fetchAndParseJSON(
  dataURL: string,
  columnsToArray?: ColumnConfigurationDataType[],
  dataTransformation?: string,
  debugMode?: boolean,
) {
  const url = dataURL;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    const reFormatedJson = reFormatData(json, dataTransformation);
    if (debugMode) {
      console.log('Data from file:', json);
    }
    if (columnsToArray) {
      const transformedData = transformColumnsToArray(
        reFormatedJson,
        columnsToArray,
      );
      if (debugMode) {
        console.log(
          'Data after transformation of column to array:',
          transformedData,
        );
      }
      return transformedData;
    }
    return reFormatedJson;
  } catch (error) {
    return error;
  }
}

export async function fetchAndTransformDataFromAPI(
  requestURL: string,
  headers?: any,
  columnsToArray?: ColumnConfigurationDataType[],
  dataTransformation?: string,
  debugMode?: boolean,
) {
  const response = await fetch(requestURL, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const json = await response.json();
  const reFormatedJson = reFormatData(json, dataTransformation);
  if (debugMode) {
    console.log('Data from api:', json);
    console.log('Data from api after transformation:', reFormatedJson);
  }
  if (columnsToArray) {
    const transformedData = transformColumnsToArray(
      reFormatedJson,
      columnsToArray,
    );
    if (debugMode) {
      console.log(
        'Data after transformation of column to array:',
        transformedData,
      );
    }
    return transformedData;
  }
  return reFormatedJson;
}

export async function fetchAndParseMultipleDataSources(
  dataURL: FileSettingsDataType[],
  idColumnTitle?: string,
) {
  const data = await Promise.all(
    dataURL.map(d =>
      d.fileType === 'json'
        ? fetchAndParseJSON(
            d.dataURL as string,
            d.columnsToArray,
            d.dataTransformation,
            false,
          )
        : d.fileType === 'api'
        ? fetchAndTransformDataFromAPI(
            d.dataURL as string,
            d.apiHeaders,
            d.columnsToArray,
            d.dataTransformation,
            false,
          )
        : fetchAndParseCSV(
            d.dataURL as string,
            d.dataTransformation,
            d.columnsToArray,
            false,
            d.delimiter,
            true,
          ),
    ),
  );
  const mergedData = mergeMultipleData(
    data.map((d: any, i: number) => ({
      data: d,
      idColumn: dataURL[i].idColumnName,
    })),
    idColumnTitle,
  );
  return mergedData;
}
