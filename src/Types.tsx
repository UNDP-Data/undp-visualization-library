export interface TimeSeriesProps {
  year: number;
  value: number;
  data?: object;
}
export type AnnotationDataType = {
  refPoint: [number, number];
  text: string;
  arrow: boolean;
};

export interface TreeMapDataType {
  label: string | number;
  size: number;
  color?: string;
  data?: object;
}

export interface VerticalBarGraphDataType {
  label: string | number;
  size: number;
  color?: string;
  data?: object;
}

export interface VerticalGroupedBarGraphDataType {
  label: string | number;
  size: number[];
  data?: object;
}

export interface HorizontalBarGraphDataType {
  size: number;
  label: string | number;
  color?: string;
  data?: object;
}

export interface HorizontalGroupedBarGraphDataType {
  size: number[];
  label: string | number;
  data?: object;
}

export interface DumbbellChartDataType {
  x: number[];
  label: string;
  data?: object;
}

export interface DonutChartDataType {
  value: number;
  label: string;
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
  label: string;
  data?: object;
}

export interface ReferenceDataType {
  value: number | null;
  text: string;
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
  columnTitle: string;
  columnId: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  suffix?: string;
  prefix?: string;
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
