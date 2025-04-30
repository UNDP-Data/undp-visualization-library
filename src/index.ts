/* ------- Style Sheet ------- */
import '@undp/design-system-react/dist/style.css';
import './styles/styles.css';

/* ------- All Graphs Components ------- */
// Bar Graph
export { SimpleBarGraph, StackedBarGraph, GroupedBarGraph } from './Components/Graphs/BarGraph';
// Circle packing graph
export { CirclePackingGraph } from './Components/Graphs/CirclePackingGraph';
// Donut chart
export { DonutChart } from './Components/Graphs/DonutChart';
// Dumbbell chart
export { DumbbellChart } from './Components/Graphs/DumbbellChart';
// BeeSwarm chart
export { BeeSwarmChart } from './Components/Graphs/BeeSwarmChart';
// Line Charts
export { DualAxisLineChart } from './Components/Graphs/LineCharts/DualAxisLineChart';
export { LineChartWithConfidenceInterval } from './Components/Graphs/LineCharts/LineChartWithConfidenceInterval';
export { SimpleLineChart } from './Components/Graphs/LineCharts/LineChart';
export { MultiLineChart } from './Components/Graphs/LineCharts/MultiLineChart';
export { DifferenceLineChart } from './Components/Graphs/LineCharts/DifferenceLineChart';
export { SparkLine } from './Components/Graphs/LineCharts/SparkLine';
// Maps
export { BiVariateChoroplethMap } from './Components/Graphs/Maps/BiVariateMap/Simple';
export { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap/Simple';
export { DotDensityMap } from './Components/Graphs/Maps/DotDensityMap/Simple';
export { GeoHubMap } from './Components/Graphs/Maps/GeoHubMaps/SimpleMap';
export { GeoHubCompareMaps } from './Components/Graphs/Maps/GeoHubMaps/CompareMaps';
export { GeoHubMapWithLayerSelection } from './Components/Graphs/Maps/GeoHubMaps/MapWithLayerSelection';
// Scatter Plot
export { ScatterPlot } from './Components/Graphs/ScatterPlot/Simple';
// Slope Chart
export { SlopeChart } from './Components/Graphs/SlopeChart';
// Area Chart
export { AreaChart } from './Components/Graphs/StackedAreaChart';
// Stat Cards
export { BasicStatCard } from './Components/Graphs/StatCard';
export { StatCardFromData } from './Components/Graphs/StatCard/StatCardFromData';
// Tree Maps
export { TreeMapGraph } from './Components/Graphs/TreeMapGraph';
// Unit Chart
export { UnitChart } from './Components/Graphs/UnitChart';
// HeatMap
export { HeatMap } from './Components/Graphs/HeatMap';
// DataTable
export { DataTable } from './Components/Graphs/DataTable';
export { DataCards } from './Components/Graphs/DataCards';
// Strip chart
export { StripChart } from './Components/Graphs/StripChart';
// Pareto Chart
export { ParetoChart } from './Components/Graphs/ParetoChart';
// Butterfly Chart
export { ButterflyChart } from './Components/Graphs/ButterflyChart/Simple';
// Histogram
export { Histogram } from './Components/Graphs/Histogram';
// Sankey Chart
export { SankeyChart } from './Components/Graphs/SankeyChart';
// Dashboard
export { MultiGraphDashboard } from './Components/Dashboard/MultiGraphDashboard';
export { MultiGraphDashboardWideToLongFormat } from './Components/Dashboard/MultiGraphDashboardWideToLongFormat';
export { SingleGraphDashboard } from './Components/Dashboard/SingleGraphDashboard';
export { GriddedGraphs } from './Components/Dashboard/GriddedGraphs';
// Dashboard from Config Files
export { MultiGraphDashboardFromConfig } from './Components/Dashboard/MultiGraphDashboardFromConfig';
export { MultiGraphDashboardWideToLongFormatFromConfig } from './Components/Dashboard/MultiGraphDashboardWideToLongFormatFromConfig';
export { SingleGraphDashboardFromConfig } from './Components/Dashboard/SingleGraphDashboardFromConfig';
export { GriddedGraphsFromConfig } from './Components/Dashboard/GriddedGraphsFromConfig';
// Animated Bar Graphs
export {
  AnimatedBarGraph,
  AnimatedGroupedBarGraph,
  AnimatedStackedBarGraph,
} from './Components/Graphs/BarGraph/Animated';
// Animated Butterfly Chart
export { AnimatedButterflyChart } from './Components/Graphs/ButterflyChart/Animated';
// Animated Dumbbell chart
export { AnimatedDumbbellChart } from './Components/Graphs/DumbbellChart/Animated';
// Animated Maps
export { AnimatedBiVariateChoroplethMap } from './Components/Graphs/Maps/BiVariateMap/Animated';
export { AnimatedChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap/Animated';
export { AnimatedDotDensityMap } from './Components/Graphs/Maps/DotDensityMap/Animated';
// Animated Scatter Plot
export { AnimatedScatterPlot } from './Components/Graphs/ScatterPlot/Animated';

/* ------- All Button ------- */
// Utility Buttons
export { ExcelDownloadButton } from './Components/Actions/ExcelDownloadButton';
export { ImageDownloadButton } from './Components/Actions/ImageDownloadButton';
export { SVGDownloadButton } from './Components/Actions/SVGDownloadButton';
export { CsvDownloadButton } from './Components/Actions/CsvDownloadButton';
export { CopyTextButton } from './Components/Actions/CopyTextButton';

/* ------- Color Palette ------- */
export { Colors } from './Components/ColorPalette';

/* ------- All Design Elements and Typography ------- */
// Color Legend
export { ColorLegend } from './Components/Elements/ColorLegend';
export { ColorLegendWithMouseOver } from './Components/Elements/ColorLegendWithMouseOver';
export { LinearColorLegend } from './Components/Elements/LinearColorLegend';
export { ThresholdColorLegendWithMouseOver } from './Components/Elements/ThresholdColorLegendWithMouseOver';
// Typography
export { GraphFooter } from './Components/Elements/GraphFooter';
export { GraphHeader } from './Components/Elements/GraphHeader';
export { FootNote } from './Components/Typography/FootNote';
export { GraphDescription } from './Components/Typography/GraphDescription';
export { GraphTitle } from './Components/Typography/GraphTitle';
export { Source } from './Components/Typography/Source';

/* ------- Utils ------- */
export { checkIfNullOrUndefined } from './Utils/checkIfNullOrUndefined';
export { generateEmbedLink, generateIframeCode } from './Utils/generateCodes';
export { getPercentileValue } from './Utils/getPercentileValue';
export { getQueryParamsFromLink } from './Utils/getQueryParamsFromLink';
export { numberFormattingFunction } from './Utils/numberFormattingFunction';
export { removeOutliers } from './Utils/removeOutliers';
export { getTextColorBasedOnBgColor } from './Utils/getTextColorBasedOnBgColor';
export { getJenks } from './Utils/getJenks';
export { imageDownload } from './Utils/imageDownload';
export { svgDownload } from './Utils/svgDownload';
export { excelDownload } from './Utils/excelDownload';
export { getUniqValue } from './Utils/getUniqValue';

/* ---------Data fetch and Parse ------------*/
export {
  fetchAndParseCSV,
  fetchAndParseJSON,
  fetchAndTransformDataFromAPI,
  fetchAndParseCSVFromTextBlob,
  fetchAndParseMultipleDataSources,
} from './Utils/fetchAndParseData';

/* ---------Data Transformations ------------*/
export { transformDataForAggregation } from './Utils/transformData/transformDataForAggregation';
export { transformColumnsToArray } from './Utils/transformData/transformColumnsToArray';
export { transformDataForGraphFromFile } from './Utils/transformData/transformDataForGraphFromFile';
export { transformDataForGraph } from './Utils/transformData/transformDataForGraph';

/* ------Schemas and Schema Validation-----------*/
export {
  validateDataSchema,
  validateSettingsSchema,
  validateConfigSchema,
} from './Utils/validateSchema';

export {
  getDataSettingsSchema,
  getReadableHeaderSchema,
  getFiltersSchema,
  getDataSelectionSchema,
  getDataFiltersSchema,
  getDataTransformSchema,
  getGraphDataConfigurationSchema,
  getSingleGraphJSONSchema,
  getGriddedGraphJSONSchema,
  getDashboardJSONSchema,
  getDashboardWideToLongFormatJSONSchema,
  getDataSchema,
  getSettingsSchema,
} from './Schemas/getSchema';

/* ---------GraphTypes-------------*/
export type { GraphType, GeoHubGraphType, GraphTypeForGriddedGraph } from '@/Types';
export { GraphList } from './Utils/getGraphList';

/* ----------Renderers For Vanilla JS-------------*/
export { Dashboard, DashboardWithDataTransform, GriddedGraph, Graph } from './Renderer';
