export interface TimeSeriesProps {
  year: number;
  value: number;
  data?: object;
}

export interface VerticalBarGraphDataType {
  label: string;
  height: number;
  color?: string;
  data?: object;
}

export interface VerticalGroupedBarGraphDataType {
  label: string;
  height: number[];
  data?: object;
}

export interface HorizontalBarGraphDataType {
  width: number;
  label: string;
  color?: string;
  data?: object;
}

export interface HorizontalGroupedBarGraphDataType {
  width: number[];
  label: string;
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
  x: number;
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
