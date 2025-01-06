export type GraphTypeForGriddedGraph =
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
  | 'animatedButterflyChart'
  | 'sankeyChart'
  | 'lineChartWithConfidenceInterval'
  | 'dataCards';

export type GeoHubGraphType =
  | 'geoHubCompareMap'
  | 'geoHubMap'
  | 'geoHubMapWithLayerSelection';

export type GraphType = GraphTypeForGriddedGraph | GeoHubGraphType;

export type CSSObject = {
  [property: string]: string | number;
};

export interface SourcesDataType {
  source: string;
  link?: string;
}

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

export interface LineChartWithConfidenceIntervalDataType {
  date: number | string;
  y?: number;
  yMin?: number;
  yMax?: number;
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

export interface SankeyDataType {
  source: string | number;
  target: string | number;
  value: number;
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

export interface NodeDataType {
  name: string;
  color: string;
  type: 'source' | 'target';
  label: string;
}

export interface NodesLinkDataType {
  nodes: NodeDataType[];
  links: {
    source: number;
    target: number;
    value: number;
  }[];
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

export interface GraphConfigurationDataType {
  columnId: string | string[];
  chartConfigId: string;
}

export interface DataSelectionDataType {
  label?: string;
  allowedColumnIds: {
    value: string;
    label: string;
    graphSettings: GraphSettingsDataType;
  }[];
  chartConfigId: string;
  ui?: 'select' | 'radio';
  width?: string;
}

export interface AdvancedDataSelectionDataType {
  label?: string;
  options: {
    label: string;
    value: string[];
    graphSettings?: GraphSettingsDataType;
  }[];
  chartConfigId: string;
  ui?: 'select' | 'radio';
  width?: string;
  defaultValue?: {
    label: string;
    value: string[];
    graphSettings?: GraphSettingsDataType;
  };
}

export interface DataFilterDataType {
  column: string;
  includeValues?: (string | number | boolean | null | undefined)[];
  excludeValues?: (string | number | boolean | null | undefined)[];
}

export type DashboardColumnDataType = {
  graphType: GraphType;
  attachedFilter?: string;
  columnWidth?: number;
  dataTransform?: {
    keyColumn: string;
    aggregationColumnsSetting?: AggregationSettingsDataType[];
  };
  dataFilters?: DataFilterDataType[];
  graphDataConfiguration?: GraphConfigurationDataType[];
  dataSelectionOptions?: DataSelectionDataType[];
  advancedDataSelectionOptions?: AdvancedDataSelectionDataType[];
  settings?: any;
};

export type StatCardsFromDataSheetDataType = {
  value: number | string;
  data?: object;
};

export type FilterUiSettingsDataType = {
  column: string;
  label?: string;
  singleSelect?: boolean;
  clearable?: boolean;
  defaultValue?: string[] | string | number | number[];
  excludeValues?: string[];
  allowSelectAll?: boolean;
  width?: string;
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

export type DashboardFromWideToLongFormatColumnDataType = {
  graphType:
    | 'donutChart'
    | 'verticalBarChart'
    | 'horizontalBarChart'
    | 'unitChart'
    | 'treeMap'
    | 'circlePacking';
  columnWidth?: number;
  dataFilters?: DataFilterDataType[];
  settings?: any;
  graphDataConfiguration?: GraphConfigurationDataType[];
};

export type DashboardFromWideToLongFormatLayoutDataType = {
  title?: string;
  description?: string;
  dropdownLabel?: string;
  padding?: string;
  backgroundColor?: string | boolean;
  rtl?: boolean;
  language?: 'ar' | 'en' | 'he';
  rows: {
    columns: DashboardFromWideToLongFormatColumnDataType[];
    height?: number;
  }[];
};

export interface ColumnConfigurationDataType {
  column: string;
  delimiter?: string;
}

export interface FileSettingsDataType {
  dataURL: string;
  idColumnName: string;
  fileType?: 'csv' | 'json' | 'api';
  delimiter?: string;
  columnsToArray?: ColumnConfigurationDataType[];
  apiHeaders?: any;
  dataTransformation?: string;
}

export interface DataSettingsDataType {
  dataURL?: string | FileSettingsDataType[];
  fileType?: 'csv' | 'json' | 'api';
  delimiter?: string;
  columnsToArray?: ColumnConfigurationDataType[];
  apiHeaders?: any;
  dataTransformation?: string;
  idColumnTitle?: string;
  data?: any;
}

export interface DataSettingsWideToLongDataType {
  dataURL?: string | FileSettingsDataType[];
  fileType?: 'csv' | 'json' | 'api';
  delimiter?: string;
  data?: any;
  keyColumn: string;
  idColumnTitle?: string;
  dataTransformation?: string;
  apiHeaders?: any;
}

export interface AggregationSettingsDataType {
  column: string;
  aggregationMethod?: 'sum' | 'average' | 'min' | 'max';
}

export interface FilterSettingsDataType {
  filter: string;
  singleSelect?: boolean;
  label: string;
  clearable?: boolean;
  defaultValue?:
    | {
        value: string | number;
        label: string | number;
      }[]
    | {
        value: string | number;
        label: string | number;
      };
  value?:
    | {
        value: string | number;
        label: string | number;
      }[]
    | {
        value: string | number;
        label: string | number;
      };
  availableValues: {
    value: string | number;
    label: string | number;
  }[];
  allowSelectAll?: boolean;
  width?: string;
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

export interface BackgroundStyleDataType {
  borderRadius?: string;
  boxShadow?: string;
  border?: string;
}

export interface GraphSettingsDataType {
  colors?: string | string[] | string[][];
  graphTitle?: string;
  labelOrder?: string[];
  graphDescription?: string;
  footNote?: string;
  height?: number;
  width?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
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
  area?: boolean;
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
  mapStyle?: string | { style: string; name: string }[];
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
  sortParameter?: number | 'diff' | 'total';
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
  mode?: 'dark' | 'light';
  maxBarThickness?: number;
  minBarThickness?: number;
  maxNumberOfBars?: number;
  includeLayers?: string[];
  excludeLayers?: string[];
  layerSelection?: { layerID: string; name: string[] }[];
  annotations?: AnnotationSettingsDataType[];
  regressionLine?: boolean | string;
  ariaLabel?: string;
  nodePadding?: number;
  nodeWidth?: number;
  highlightedSourceDataPoints?: string[];
  highlightedTargetDataPoints?: string[];
  defaultLinkOpacity?: number;
  sourceTitle?: string;
  targetTitle?: string;
  animateLinks?: boolean | number;
  sortNodes?: 'asc' | 'desc' | 'mostReadable' | 'none';
  sourceColors?: string[] | string;
  targetColors?: string[] | string;
  sourceColorDomain?: string[];
  targetColorDomain?: string[];
  showIntervalDots?: boolean;
  showIntervalValues?: boolean;
  intervalLineStrokeWidth?: number;
  intervalLineColors?: [string, string];
  intervalAreaColor?: string;
  cardTemplate?: string;
  cardBackgroundColor?: string;
  legendMaxWidth?: string;
  cardFilters?: {
    column: string;
    label?: string;
    defaultValue?: string | number;
    excludeValues?: (string | number)[];
    width?: string;
  }[];
  cardSortingOptions?: {
    defaultValue?: string;
    options: {
      value: string;
      label: string;
      type: 'asc' | 'desc';
    }[];
    width?: string;
  };
  cardSearchColumns?: string[];
  cardMinWidth?: number;
  textBackground?: boolean;
  headingFontSize?: string;
  centerAlign?: boolean;
  verticalAlign?: 'center' | 'top' | 'bottom';
  backgroundStyle?: BackgroundStyleDataType;
  cardBackgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  intervalAreaOpacity?: number;
  detailsOnClick?: string;
  tooltipBackgroundStyle?: CSSObject;
  valueColor?: string;
  labelColor?: string;
  noOfYTicks?: number;
  noOfTicks?: number;
  minDate: string | number;
  maxDate: string | number;
  colorLegendColors: string[];
  colorLegendDomains: string[];
  barAxisTitle?: string;
  barSuffix?: string;
  barPrefix?: string;
  lineSuffix?: string;
  linePrefix?: string;
  xSuffix?: string;
  xPrefix?: string;
  ySuffix?: string;
  yPrefix?: string;
  lineSuffixes?: [string, string];
  linePrefixes?: [string, string];
}
