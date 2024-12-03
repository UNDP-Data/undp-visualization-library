/* ------- Style Sheet ------- */
import './styles/styles.css';

/* ------- All Graphs Components ------- */
// Horizontal Bar Graph
export { HorizontalGroupedBarGraph } from './Components/Graphs/BarGraph/HorizontalBarGraph/GroupedBarGraph';
export { HorizontalBarGraph } from './Components/Graphs/BarGraph/HorizontalBarGraph/SimpleBarGraph';
export { HorizontalStackedBarGraph } from './Components/Graphs/BarGraph/HorizontalBarGraph/StackedBarGraph';
// Vertical Bar Graph
export { VerticalGroupedBarGraph } from './Components/Graphs/BarGraph/VerticalBarGraph/GroupedBarGraph';
export { VerticalBarGraph } from './Components/Graphs/BarGraph/VerticalBarGraph/SimpleBarGraph';
export { VerticalStackedBarGraph } from './Components/Graphs/BarGraph/VerticalBarGraph/StackedBarGraph';
// Circle packing graph
export { CirclePackingGraph } from './Components/Graphs/CirclePackingGraph';
// Donut chart
export { DonutChart } from './Components/Graphs/DonutChart';
// Dumbbell chart
export { HorizontalDumbbellChart } from './Components/Graphs/DumbbellChart/HorizontalDumbbellChart/SimpleDumbbellChart';
export { VerticalDumbbellChart } from './Components/Graphs/DumbbellChart/VerticalDumbbellChart/SimpleDumbbellChart';
// BeeSwarm chart
export { HorizontalBeeSwarmChart } from './Components/Graphs/BeeSwarmChart/HorizontalBeeSwarmChart';
export { VerticalBeeSwarmChart } from './Components/Graphs/BeeSwarmChart/VerticalBeeSwarmChart';
// Line Charts
export { DualAxisLineChart } from './Components/Graphs/LineCharts/DualAxisLineChart';
export { LineChartWithConfidenceInterval } from './Components/Graphs/LineCharts/LineChartWithConfidenceInterval';
export { SimpleLineChart } from './Components/Graphs/LineCharts/LineChart';
export { MultiLineChart } from './Components/Graphs/LineCharts/MultiLineChart';
export { DifferenceLineChart } from './Components/Graphs/LineCharts/DifferenceLineChart';
export { SparkLine } from './Components/Graphs/LineCharts/SparkLine';
// Maps
export { BiVariantMap } from './Components/Graphs/Maps/BiVariateMap/SimpleBiVariateMap';
export { ChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap/SimpleChoroplethMap';
export { DotDensityMap } from './Components/Graphs/Maps/DotDensityMap/SimpleDotDensityMap';
export { GeoHubMap } from './Components/Graphs/Maps/GeoHubMap';
export { GeoHubCompareMaps } from './Components/Graphs/Maps/GeoHubCompareMaps';
export { GeoHubMapWithLayerSelection } from './Components/Graphs/Maps/GeoHubMapWithLayerSelection';
// Scatter Plot
export { ScatterPlot } from './Components/Graphs/ScatterPlot/SimpleScatterPlot';
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
export { HorizontalStripChart } from './Components/Graphs/StripChart/HorizontalStripChart';
export { VerticalStripChart } from './Components/Graphs/StripChart/VerticalStripChart';
// Pareto Chart
export { ParetoChart } from './Components/Graphs/ParetoChart';
// Butterfly Chart
export { ButterflyChart } from './Components/Graphs/ButterflyChart/SimpleButterflyChart';
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
// Animated Horizontal Bar Graphs
export { AnimatedHorizontalBarChart } from './Components/Graphs/BarGraph/HorizontalBarGraph/AnimatedBarChart';
export { AnimatedHorizontalStackedBarChart } from './Components/Graphs/BarGraph/HorizontalBarGraph/AnimatedStackedBarChart';
export { AnimatedHorizontalGroupedBarGraph } from './Components/Graphs/BarGraph/HorizontalBarGraph/AnimatedGroupedBarGraph';
// Animated Vertical Bar Graphs
export { AnimatedVerticalBarChart } from './Components/Graphs/BarGraph/VerticalBarGraph/AnimatedBarChart';
export { AnimatedVerticalStackedBarChart } from './Components/Graphs/BarGraph/VerticalBarGraph/AnimatedStackedBarChart';
export { AnimatedVerticalGroupedBarGraph } from './Components/Graphs/BarGraph/VerticalBarGraph/AnimatedGroupedBarGraph';
// Animated Butterfly Chart
export { AnimatedButterflyChart } from './Components/Graphs/ButterflyChart/AnimatedButterflyChart';
// Animated Dumbbell chart
export { AnimatedHorizontalDumbbellChart } from './Components/Graphs/DumbbellChart/HorizontalDumbbellChart/AnimatedDumbbellChart';
export { AnimatedVerticalDumbbellChart } from './Components/Graphs/DumbbellChart/VerticalDumbbellChart/AnimatedDumbbellChart';
// Animated Maps
export { AnimatedBiVariantMap } from './Components/Graphs/Maps/BiVariateMap/AnimatedBiVariateMap';
export { AnimatedChoroplethMap } from './Components/Graphs/Maps/ChoroplethMap/AnimatedChoroplethMap';
export { AnimatedDotDensityMap } from './Components/Graphs/Maps/DotDensityMap/AnimatedDotDensityMap';
// Animated Scatter Plot
export { AnimatedScatterPlot } from './Components/Graphs/ScatterPlot/AnimatedScatterPlot';

/* ------- All Button ------- */
// Utility Buttons
export { ExcelDownloadButton } from './Components/Actions/ExcelDownloadButton';
export { ImageDownloadButton } from './Components/Actions/ImageDownloadButton';
export { SVGDownloadButton } from './Components/Actions/SVGDownloadButton';
export { CsvDownloadButton } from './Components/Actions/CsvDownloadButton';
export { CopyTextButton } from './Components/Actions/CopyTextButton';

/* ------- Color Palette ------- */
export { UNDPColorModule } from './Components/ColorPalette';

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
export { getEmbedLink } from './Utils/getEmbedCode';
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
export { fetchAndParseCSV } from './Utils/fetchAndParseData';
export { fetchAndParseJSON } from './Utils/fetchAndParseData';
export { fetchAndTransformDataFromAPI } from './Utils/fetchAndParseData';
export { fetchAndParseCSVFromTextBlob } from './Utils/fetchAndParseData';
export { fetchAndParseMultipleDataSources } from './Utils/fetchAndParseData';

/* ---------Data Transformations ------------*/
export { transformDataForAggregation } from './Utils/transformData/transformDataForAggregation';
export { transformColumnsToArray } from './Utils/transformData/transformColumnsToArray';
export { transformDataForGraphFromFile } from './Utils/transformData/transformDataForGraphFromFile';
export { transformDataForGraph } from './Utils/transformData/transformDataForGraph';

/* ------Schemas and Schema Validation-----------*/
export {
  validateDataSchema,
  validateSettingsSchema,
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
export type {
  GraphType,
  GeoHubGraphType,
  GraphTypeForGriddedGraph,
} from './Types';
export { GraphList } from './Utils/getGraphList';

/* ----------Renderers For Vanilla JS-------------*/
export {
  Dashboard,
  DashboardWithDataTransform,
  GriddedGraph,
  Graph,
} from './Renderer';
