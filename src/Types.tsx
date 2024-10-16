export type GraphType =
  | 'horizontalBarChart'
  | 'horizontalStackedBarChart'
  | 'horizontalGroupedBarChart'
  | 'verticalBarChart'
  | 'verticalStackedBarChart'
  | 'verticalGroupedBarChart'
  | 'lineChart'
  | 'dualAxisLineChart'
  | 'multiLineChart'
  | 'differenceLineChart'
  | 'stackedAreaChart'
  | 'choroplethMap'
  | 'biVariateChoroplethMap'
  | 'dotDensityMap'
  | 'donutChart'
  | 'slopeChart'
  | 'scatterPlot'
  | 'horizontalDumbbellChart'
  | 'verticalDumbbellChart'
  | 'treeMap'
  | 'circlePacking'
  | 'heatMap'
  | 'horizontalStripChart'
  | 'verticalStripChart'
  | 'horizontalBeeSwarmChart'
  | 'verticalBeeSwarmChart'
  | 'butterflyChart'
  | 'histogram'
  | 'sparkLine'
  | 'paretoChart'
  | 'dataTable'
  | 'statCard'
  | 'geoHubCompareMap'
  | 'geoHubMap'
  | 'unitChart'
  | 'animatedScatterPlot'
  | 'animatedHorizontalBarChart'
  | 'animatedHorizontalStackedBarChart'
  | 'animatedHorizontalGroupedBarChart'
  | 'animatedVerticalBarChart'
  | 'animatedVerticalStackedBarChart'
  | 'animatedVerticalGroupedBarChart'
  | 'animatedChoroplethMap'
  | 'animatedBiVariateChoroplethMap'
  | 'animatedDotDensityMap'
  | 'animatedHorizontalDumbbellChart'
  | 'animatedVerticalDumbbellChart'
  | 'animatedButterflyChart';

export interface TimeSeriesProps {
  year: number;
  value: number;
  data?: object;
}

export interface UnitChartDataType {
  label: number | string;
  value: number;
  data?: object;
}

export interface TreeMapDataType {
  label: string | number;
  size?: number;
  color?: string;
  data?: object;
}

export interface ButterflyChartDataType {
  label: string | number;
  leftBar?: number;
  rightBar?: number;
  data?: object;
}

export interface ButterflyChartWithDateDataType extends ButterflyChartDataType {
  date: string | number;
}

export interface BarGraphDataType {
  label: string | number;
  size?: number;
  color?: string;
  data?: object;
}

export interface BarGraphWithDateDataType extends BarGraphDataType {
  date: string | number;
}

export interface GroupedBarGraphDataType {
  label: string | number;
  size: (number | undefined)[];
  data?: object;
}

export interface SdgChartDataType {
  target: string | number;
  value: number | undefined | string;
  data?: object;
}

export interface SdgChartWithDateDataType extends SdgChartDataType {
  date: string | number;
}

export interface GroupedBarGraphWithDateDataType
  extends GroupedBarGraphDataType {
  date: string | number;
}

export interface DumbbellChartDataType {
  x: (number | undefined)[];
  label: string;
  data?: object;
}

export interface DumbbellChartWithDateDataType {
  x: (number | undefined)[];
  date: string | number;
  label: string;
  data?: object;
}

export interface DonutChartDataType {
  size: number;
  label: string;
  data?: object;
}

export interface HistogramDataType {
  value: number;
  data?: object;
}

export interface ChoroplethMapDataType {
  x?: number | string;
  countryCode: string;
  data?: object;
}

export interface ChoroplethMapWithDateDataType {
  x?: number | string;
  countryCode: string;
  date: string | number;
  data?: object;
}

export interface BivariateMapDataType {
  x?: number;
  y?: number;
  countryCode: string;
  data?: object;
}

export interface BivariateMapWithDateDataType {
  x?: number;
  y?: number;
  countryCode: string;
  date: string | number;
  data?: object;
}

export interface LineChartDataType {
  date: number | string;
  y: number;
  data?: object;
}

export interface MultiLineChartDataType {
  date: number | string;
  y: (number | undefined)[];
  data?: object;
}

export interface AreaChartDataType {
  date: number | string;
  y: number[];
  data?: object;
}

export interface ScatterPlotDataType {
  x?: number;
  y?: number;
  radius?: number;
  color?: string;
  label?: string | number;
  data?: object;
}

export interface ScatterPlotWithDateDataType {
  date: string | number;
  label: string | number;
  x?: number;
  y?: number;
  radius?: number;
  color?: string;
  data?: object;
}

export interface DualAxisLineChartDataType {
  date: number | string;
  y1?: number;
  y2?: number;
  data?: object;
}

export interface DifferenceLineChartDataType {
  date: number | string;
  y1: number;
  y2: number;
  data?: object;
}

export interface ParetoChartDataType {
  label: number | string;
  bar?: number;
  line?: number;
  data?: object;
}

export interface DotDensityMapDataType {
  lat: number;
  long: number;
  radius?: number;
  color?: string | number;
  label?: string | number;
  data?: object;
}

export interface DotDensityMapWithDateDataType extends DotDensityMapDataType {
  date: string | number;
}

export interface SlopeChartDataType {
  y1: number;
  y2: number;
  color?: string | number;
  label: string | number;
  data?: object;
}

export interface HeatMapDataType {
  row: string;
  column: string;
  value?: string | number;
  data?: object;
}

export interface BeeSwarmChartDataType {
  label: string | number;
  position: number;
  radius?: number;
  color?: string;
  data?: object;
}

export interface StripChartDataType {
  label: string | number;
  position: number;
  color?: string;
  data?: object;
}

export interface TableColumnSettingsDataType {
  title: string;
  size?: number;
  type: string;
}

export interface DataTableColumnDataType {
  columnTitle?: string;
  columnId: string;
  sortable?: boolean;
  filterOptions?: string[];
  chip?: boolean;
  chipColors?: {
    value: string;
    color: string;
  }[];
  separator?: string;
  align?: 'left' | 'right' | 'center';
  suffix?: string;
  prefix?: string;
  columnWidth?: number;
}

export type ScaleDataType = 'categorical' | 'linear' | 'threshold';

export interface ReferenceDataType {
  value: number | null;
  text: string;
  color?: string;
}

export type AnnotationDataType = {
  refPoint: [number, number];
  text: string;
  arrow: boolean;
  color?: string;
};

export interface GraphConfigurationDataType {
  columnId: string | string[];
  chartConfigId: string;
}

export interface DataSelectionDataType {
  label?: string;
  allowedColumnIds: {
    value: string;
    label: string;
  }[];
  chartConfigId: string;
}

export interface DataFilterDataType {
  column: string;
  values: (string | number | boolean)[];
}

export type DashboardColumnDataType = {
  graphType: GraphType;
  columnWidth?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting: AggregationSettingsDataType[];
  };
  dataFilter?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  settings?: any;
};

export type StatCardsFromDataSheetDataType = {
  value: number | string;
  data?: object;
};

export type FilterUiSettingsDataType = {
  column: string;
  singleSelect?: boolean;
  clearable?: boolean;
  defaultValue?: string[] | string;
};

export type DashboardLayoutDataType = {
  title?: string;
  description?: string;
  padding?: string;
  backgroundColor?: string | boolean;
  rtl?: boolean;
  language?: 'ar' | 'en' | 'he';
  rows: {
    columns: DashboardColumnDataType[];
    height?: number;
  }[];
};

export interface ColumnConfigurationDataType {
  column: string;
  delimiter?: string;
}

export interface DataSettingsDataType {
  dataURL?: string;
  fileType?: 'csv' | 'json';
  delimiter?: string;
  columnsToArray?: ColumnConfigurationDataType[];
  data?: any;
}

export interface APISettingsDataType {
  requestURL: string;
  headers?: any;
  method?: 'POST' | 'GET' | 'DELETE' | 'PUT';
  requestBody?: any;
  apiDataTransform?: (_d: any) => any;
}

export interface AggregationSettingsDataType {
  column: string;
  aggregationMethod: 'sum' | 'average' | 'min' | 'max';
}

export interface SelectedFilterDataType {
  filter: string;
  value?: string[];
}

export interface FilterSettingsDataType {
  filter: string;
  singleSelect?: boolean;
  clearable?: boolean;
  defaultValue?: string[] | string;
  availableValues: {
    value: string;
    label: string;
  }[];
}

export interface MarginDataType {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface AnnotationSettingsDataType {
  text: string;
  maxWidth?: number;
  xCoordinate?: number | string;
  yCoordinate?: number | string;
  xOffset?: number;
  yOffset?: number;
  align?: 'center' | 'left' | 'right';
  color?: string;
  fontWeight?: 'regular' | 'bold' | 'medium';
  showConnector?: boolean | number;
  connectorRadius?: number;
}

export interface CustomHighlightAreaSettingsDataType {
  coordinates: (number | string)[];
  color?: string;
  strokeWidth?: number;
  dashedStroke?: boolean;
}

export interface GraphSettingsDataType {
  colors?: string | string[] | string[][];
  graphTitle?: string;
  labelOrder?: string[];
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  height?: number;
  width?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  barPadding?: number;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showColorScale?: boolean;
  maxValue?: number;
  minValue?: number;
  tooltip?: string;
  refValues?: ReferenceDataType[];
  graphID?: string;
  highlightedDataPoints?: (string | number)[];
  graphDownload?: boolean;
  sortData?: 'desc' | 'asc';
  dataDownload?: boolean;
  maxRadiusValue?: number;
  maxPositionValue?: number;
  minPositionValue?: number;
  leftBarTitle?: string;
  rightBarTitle?: string;
  barColors?: [string, string];
  centerGap?: number;
  columnData?: DataTableColumnDataType[];
  mainText?: string;
  subNote?: string;
  radius?: number;
  strokeWidth?: number;
  graphLegend?: boolean;
  showValues?: boolean;
  scaleType?: ScaleDataType;
  domain?: number[] | string[];
  showColumnLabels?: boolean;
  showRowLabels?: boolean;
  noDataColor?: string;
  fillContainer?: boolean;
  color?: string[] | string;
  numberOfBins?: number;
  donutStrokeWidth?: number;
  barGraphLayout?: 'horizontal' | 'vertical';
  graphType?: 'circlePacking' | 'treeMap' | 'barGraph' | 'donutChart';
  donutColorDomain?: string[];
  lineTitles?: [string, string];
  noOfXTicks?: number;
  dateFormat?: string;
  lineColors?: [string, string];
  sameAxes?: boolean;
  highlightAreaSettings?:
    | [number | string | null, number | string | null]
    | [number | null, number | null, number | null, number | null];
  highlightAreaColor?: string;
  labels?: string[];
  showColorLegendAtTop?: boolean;
  highlightedLines?: string[];
  areaId?: string;
  mapData?: any;
  xColorLegendTitle?: string;
  yColorLegendTitle?: string;
  xDomain?: [number, number, number, number];
  yDomain?: [number, number, number, number];
  scale?: number;
  centerPoint?: [number, number];
  mapBorderWidth?: number;
  mapNoDataColor?: string;
  mapBorderColor?: string;
  isWorldMap?: boolean;
  zoomScaleExtend?: [number, number];
  zoomTranslateExtend?: [[number, number], [number, number]];
  highlightedCountryCodes?: string[];
  mapProperty?: string;
  showAntarctica?: boolean;
  categorical?: boolean;
  mapStyles: [string, string];
  center?: [number, number];
  zoomLevel?: number;
  mapStyle?: string;
  barTitle?: string;
  lineTitle?: string;
  barColor?: string;
  lineColor?: string;
  showLabels?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
  refXValues?: ReferenceDataType[];
  refYValues?: ReferenceDataType[];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  maxXValue?: number;
  minXValue?: number;
  maxYValue?: number;
  minYValue?: number;
  axisTitle?: [string, string];
  year?: number | string;
  aggregationMethod?: 'count' | 'max' | 'min' | 'average' | 'sum';
  stripType?: 'strip' | 'dot';
  showAxis?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'en' | 'he';
  animateLine?: boolean | number;
  highlightColor?: string;
  dotOpacity?: number;
  sortParameter?: number | 'diff';
  arrowConnector?: boolean;
  connectorStrokeWidth?: number;
  countOnly?: (string | number)[];
  value?: number;
  gridSize?: number;
  unitPadding?: number;
  size?: number;
  totalNoOfDots?: number;
  showStrokeForWhiteDots?: boolean;
  note?: string;
  showNAColor?: boolean;
  minHeight?: number;
  autoPlay?: boolean;
  autoSort?: boolean;
  showOnlyActiveDate?: boolean;
  showDots?: boolean;
  diffAreaColors?: [string, string];
  idSuffix?: string;
}
