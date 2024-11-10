/* eslint-disable no-console */
import Papa from 'papaparse';
import Handlebars from 'handlebars';
import { ColumnConfigurationDataType, FileSettingsDataType } from '../Types';
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
  dataTransformation?: string,
  columnsToArray?: ColumnConfigurationDataType[],
  debugMode?: boolean,
) {
  const url = dataURL;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    if (debugMode) {
      console.log('Data from file:', json);
    }
    if (columnsToArray) {
      const transformedData = transformColumnsToArray(json, columnsToArray);
      if (debugMode) {
        console.log(
          'Data after transformation of column to array:',
          transformedData,
        );
      }
      return reFormatData(json, dataTransformation);
    }
    return reFormatData(json, dataTransformation);
  } catch (error) {
    return error;
  }
}

export async function fetchAndTransformDataFromAPI(
  requestURL: string,
  dataTransformation?: string,
  method?: 'POST' | 'GET' | 'DELETE' | 'PUT',
  headers?: any,
  requestBody?: any,
  debugMode?: boolean,
) {
  const response = await fetch(requestURL, {
    method: method || 'GET',
    headers,
    body: requestBody,
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  if (debugMode) {
    console.log('Data from api:', response.json());
    console.log(
      'Data from api after transformation:',
      reFormatData(response.json(), dataTransformation),
    );
  }
  return reFormatData(response.json(), dataTransformation);
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
            d.dataTransformation,
            d.columnsToArray,
            false,
          )
        : d.fileType === 'api'
        ? fetchAndTransformDataFromAPI(
            d.dataURL as string,
            d.dataTransformation,
            d.apiMethod || 'GET',
            d.apiHeaders,
            d.apiRequestBody,
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
