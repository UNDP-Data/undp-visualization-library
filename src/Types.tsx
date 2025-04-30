/* eslint-disable @typescript-eslint/no-explicit-any */
export type Languages =
  | 'en'
  | 'ar'
  | 'az'
  | 'bn'
  | 'cy'
  | 'he'
  | 'hi'
  | 'jp'
  | 'ka'
  | 'km'
  | 'ko'
  | 'my'
  | 'ne'
  | 'zh'
  | 'custom';

export type GraphTypeForGriddedGraph =
  | 'barChart'
  | 'stackedBarChart'
  | 'groupedBarChart'
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
  | 'dumbbellChart'
  | 'treeMap'
  | 'circlePacking'
  | 'heatMap'
  | 'stripChart'
  | 'beeSwarmChart'
  | 'butterflyChart'
  | 'histogram'
  | 'sparkLine'
  | 'paretoChart'
  | 'dataTable'
  | 'statCard'
  | 'unitChart'
  | 'animatedScatterPlot'
  | 'animatedBarChart'
  | 'animatedStackedBarChart'
  | 'animatedGroupedBarChart'
  | 'animatedChoroplethMap'
  | 'animatedBiVariateChoroplethMap'
  | 'animatedDotDensityMap'
  | 'animatedDumbbellChart'
  | 'animatedButterflyChart'
  | 'sankeyChart'
  | 'lineChartWithConfidenceInterval'
  | 'dataCards';

export type GeoHubGraphType = 'geoHubCompareMap' | 'geoHubMap' | 'geoHubMapWithLayerSelection';

export type GraphType = GraphTypeForGriddedGraph | GeoHubGraphType;

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
  size?: number | null;
  color?: string;
  data?: object;
}

export interface ButterflyChartDataType {
  label: string | number;
  leftBar?: number | null;
  rightBar?: number | null;
  data?: object;
}

export interface ButterflyChartWithDateDataType extends ButterflyChartDataType {
  date: string | number;
}

export interface AxesStyleObject {
  gridLines?: React.CSSProperties;
  labels?: React.CSSProperties;
  title?: React.CSSProperties;
  axis?: React.CSSProperties;
}

export interface StyleObject {
  title?: React.CSSProperties;
  footnote?: React.CSSProperties;
  source?: React.CSSProperties;
  description?: React.CSSProperties;
  graphBackground?: React.CSSProperties;
  tooltip?: React.CSSProperties;
  xAxis?: AxesStyleObject;
  yAxis?: AxesStyleObject;
  graphObjectValues?: React.CSSProperties;
  dataConnectors?: React.CSSProperties;
  mouseOverLine?: React.CSSProperties;
  regLine?: React.CSSProperties;
  dataCards?: React.CSSProperties;
}

export interface AxesClassNameObject {
  gridLines?: string;
  labels?: string;
  title?: string;
  axis?: string;
}
export interface ClassNameObject {
  title?: string;
  footnote?: string;
  source?: string;
  description?: string;
  tooltip?: string;
  xAxis?: AxesClassNameObject;
  yAxis?: AxesClassNameObject;
  legend?: string;
  graph?: string;
  graphObjectValues?: string;
  dataConnectors?: string;
  mouseOverLine?: string;
  regLine?: string;
  dataCards?: string;
}

export interface BarGraphDataType {
  label: string | number;
  size?: number | null;
  color?: string | null;
  data?: object;
}

export interface BarGraphWithDateDataType extends BarGraphDataType {
  date: string | number;
}

export interface GroupedBarGraphDataType {
  label: string | number;
  size: (number | undefined | null)[];
  data?: object;
}

export interface GroupedBarGraphWithDateDataType extends GroupedBarGraphDataType {
  date: string | number;
}

export interface DumbbellChartDataType {
  x: (number | undefined | null)[];
  label: string;
  data?: object;
}

export interface DumbbellChartWithDateDataType {
  x: (number | undefined | null)[];
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
  x?: number | string | null;
  id: string;
  data?: object;
}

export interface ChoroplethMapWithDateDataType {
  x?: number | string | null;
  id: string;
  date: string | number;
  data?: object;
}

export interface BivariateMapDataType {
  x?: number | null;
  y?: number | null;
  id: string;
  data?: object;
}

export interface BivariateMapWithDateDataType {
  x?: number | null;
  y?: number | null;
  id: string;
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
  y?: number | null;
  yMin?: number | null;
  yMax?: number | null;
  data?: object;
}

export interface MultiLineChartDataType {
  date: number | string;
  y: (number | undefined | null)[];
  data?: object;
}

export interface AreaChartDataType {
  date: number | string;
  y: number[];
  data?: object;
}

export interface ScatterPlotDataType {
  x?: number | null;
  y?: number | null;
  radius?: number | null;
  color?: string | null;
  label?: string | number | null;
  data?: object;
}

export interface ScatterPlotWithDateDataType {
  date: string | number;
  label: string | number;
  x?: number | null;
  y?: number | null;
  radius?: number | null;
  color?: string | null;
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
  styles?: {
    line?: React.CSSProperties;
    text?: React.CSSProperties;
  };
  classNames?: {
    line?: string;
    text?: string;
  };
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
    dataConfiguration: {
      columnId: string[] | string;
      chartConfigId: string;
    }[];
    graphSettings?: GraphSettingsDataType;
  }[];
  ui?: 'select' | 'radio';
  width?: string;
  defaultValue?: {
    label: string;
    dataConfiguration: {
      columnId: string[] | string;
      chartConfigId: string;
    }[];
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
  settings?: GraphSettingsDataType;
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

export type HighlightDataPointSettingsDataType = {
  column: string;
  label?: string;
  defaultValues?: (string | number)[];
  excludeValues?: (string | number)[];
  width?: string;
};

export type DashboardLayoutDataType = {
  title?: string;
  description?: string;
  padding?: string;
  backgroundColor?: string | boolean;
  language?: Languages;
  rows: {
    columns: DashboardColumnDataType[];
    height?: number;
  }[];
};

export type DashboardFromWideToLongFormatColumnDataType = {
  graphType: 'donutChart' | 'barChart' | 'unitChart' | 'treeMap' | 'circlePacking';
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
  language?: Languages;
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
  classNames?: {
    connector?: string;
    text?: string;
  };
  styles?: {
    connector?: React.CSSProperties;
    text?: React.CSSProperties;
  };
}

export interface HighlightAreaSettingsDataType {
  coordinates: [number | string | null, number | string | null];
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface CustomHighlightAreaSettingsDataType {
  coordinates: (number | string)[];
  closePath?: boolean;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface HighlightAreaSettingsForScatterPlotDataType {
  coordinates: [number | null, number | null, number | null, number | null];
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface CustomHighlightAreaSettingsForScatterPlotDataType {
  coordinates: number[];
  closePath?: boolean;
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export interface BackgroundStyleDataType {
  borderRadius?: string;
  boxShadow?: string;
  border?: string;
}

export interface GraphSettingsDataType {
  colors?: string | string[] | string[][];
  orientation?: 'horizontal' | 'vertical';
  axisTitles?: [string, string];
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
  colorDomain?: string[] | number[];
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
  showValues?: boolean;
  scaleType?: ScaleDataType;
  showColumnLabels?: boolean;
  showRowLabels?: boolean;
  noDataColor?: string;
  fillContainer?: boolean;
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
    | HighlightAreaSettingsDataType[]
    | HighlightAreaSettingsForScatterPlotDataType[];
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
  highlightedIds?: string[];
  mapProperty?: string;
  showAntarctica?: boolean;
  categorical?: boolean;
  mapStyles?: [string, string];
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
  language?: Languages;
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
  theme?: 'dark' | 'light';
  uiMode?: 'light' | 'normal';
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
  resetSelectionOnDoubleClick?: boolean;
  intervalAreaOpacity?: number;
  detailsOnClick?: string;
  valueColor?: string;
  labelColor?: string;
  noOfYTicks?: number;
  noOfTicks?: number;
  minDate?: string | number;
  maxDate?: string | number;
  colorLegendColors?: string[];
  colorLegendDomain?: string[];
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
  allowDataDownloadOnDetail?: string | boolean;
  noOfItemsInAPage?: number;
  curveType?: 'linear' | 'curve' | 'step' | 'stepAfter' | 'stepBefore';
  styles?: StyleObject;
  classNames?: ClassNameObject;
  mapProjection?: 'mercator' | 'equalEarth' | 'naturalEarth' | 'orthographic' | 'albersUSA';
  filterNA?: boolean;
}
