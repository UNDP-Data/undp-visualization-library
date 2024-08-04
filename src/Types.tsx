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
  | 'statCards'
  | 'horizontalBeeSwarmChart'
  | 'verticalBeeSwarmChart'
  | 'butterflyChart'
  | 'histogram'
  | 'sparkLine'
  | 'paretoChart'
  | 'dataTable'
  | 'statCard';

export interface TimeSeriesProps {
  year: number;
  value: number;
  data?: object;
}

export interface TreeMapDataType {
  label: string | number;
  size: number;
  color?: string;
  data?: object;
}

export interface ButterflyChartDataType {
  label: string | number;
  leftBar?: number;
  rightBar?: number;
  data?: object;
}

export interface BarGraphDataType {
  label: string | number;
  size: number | undefined;
  color?: string;
  data?: object;
}

export interface GroupedBarGraphDataType {
  label: string | number;
  size: (number | undefined)[];
  data?: object;
}

export interface DumbbellChartDataType {
  x: number[];
  label: string;
  data?: object;
}

export interface DonutChartDataType {
  size: number;
  label: string;
  data?: object;
}

export interface HistogramDataType {
  value: number | string;
  data?: object;
}

export interface ChoroplethMapDataType {
  x: number | string;
  countryCode: string;
  data?: object;
}

export interface BivariateMapDataType {
  x: number;
  y: number;
  countryCode: string;
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
  x: number;
  y: number;
  radius?: number;
  color?: string;
  label?: string;
  data?: object;
}

export interface TableColumnSettingsDataType {
  title: string;
  size?: number;
  type: string;
}

export interface DualAxisLineChartDataType {
  date: number | string;
  y1?: number;
  y2?: number;
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

export type DashboardColumnDataType = {
  graphType: GraphType;
  columnWidth?: number;
  aggregationSettings?: {
    keyColumn: string;
    aggregationColumnsSetting: AggregationSettingsDataType[];
  };
  graphDataConfiguration: GraphConfigurationDataType[];
  settings?: any;
};

export type StatCardsFromDataSheetDataType = {
  value: number | string;
  data?: object;
};

export type DashboardLayoutDataType = {
  title?: string;
  description?: string;
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
  dataURL: string;
  fileType: 'csv' | 'json';
  delimiter?: string;
  columnsToArray?: ColumnConfigurationDataType[];
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
  availableValues: {
    value: string;
    label: string;
  }[];
}
