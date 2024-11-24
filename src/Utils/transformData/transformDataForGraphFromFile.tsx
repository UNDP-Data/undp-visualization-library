import {
  ColumnConfigurationDataType,
  FileSettingsDataType,
  GraphConfigurationDataType,
  GraphType,
} from '../../Types';
import {
  fetchAndParseJSON,
  fetchAndParseCSV,
  fetchAndTransformDataFromAPI,
  fetchAndParseMultipleDataSources,
} from '../fetchAndParseData';
import { transformDataForGraph } from './transformDataForGraph';

export async function transformDataForGraphFromFile(
  dataURL: string | FileSettingsDataType[],
  dataConfiguration: GraphConfigurationDataType[],
  graph: GraphType,
  fileType?: 'csv' | 'json' | 'api',
  delimiter?: string,
  columnsToArray?: ColumnConfigurationDataType[],
  apiHeaders?: any,
  dataTransformation?: string,
  idColumnTitle?: string,
): Promise<any> {
  // Ensure the function returns a Promise
  try {
    const fetchedData = await (typeof dataURL === 'string'
      ? fileType === 'json'
        ? fetchAndParseJSON(dataURL, dataTransformation, columnsToArray, false)
        : fileType === 'api'
        ? fetchAndTransformDataFromAPI(
            dataURL,
            apiHeaders,
            dataTransformation,
            false,
          )
        : fetchAndParseCSV(
            dataURL,
            dataTransformation,
            columnsToArray,
            false,
            delimiter,
            true,
          )
      : fetchAndParseMultipleDataSources(dataURL, idColumnTitle));

    const formattedData = transformDataForGraph(
      fetchedData,
      graph,
      dataConfiguration as GraphConfigurationDataType[],
    );
    return formattedData;
  } catch (error) {
    console.error('Error fetching or processing data', error);
    return null; // Return null in case of any errors
  }
}
