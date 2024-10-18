import { GraphConfigurationDataType, GraphType } from '../../Types';
import { fetchAndParseJSON, fetchAndParseCSV } from '../fetchAndParseData';
import { transformDataForGraph } from './transformDataForGraph';

export async function transformDataForGraphFromFile(
  dataURL: string,
  dataConfiguration: GraphConfigurationDataType[],
  graph: GraphType,
  fileType?: string,
  delimiter?: string,
): Promise<any> {
  // Ensure the function returns a Promise
  try {
    const fetchedData = await (fileType === 'json'
      ? fetchAndParseJSON(dataURL)
      : fetchAndParseCSV(dataURL, undefined, false, delimiter));

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
