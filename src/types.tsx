export interface TimeSeriesProps {
  year: number;
  value: number;
}

export interface VerticalBarGraphDataType {
  label: string;
  height: number;
  color?: string;
}

export interface VerticalGroupedBarGraphDataType {
  label: string;
  height: number[];
}

export interface HorizontalBarGraphDataType {
  width: number;
  label: string;
  color?: string;
}

export interface HorizontalGroupedBarGraphDataType {
  width: number[];
  label: string;
}

export interface DumbbellChartDataType {
  x: number[];
  label: string;
}

export interface DonutChartDataType {
  value: number;
  label: string;
}

export interface ChoroplethMapDataType {
  x: number;
  countryCode: string;
}

export interface BivariateMapDataType {
  x: number;
  y: number;
  countryCode: string;
}

export interface LineChartDataType {
  date: number | string;
  y: number;
}

export interface MultiLineChartDataType {
  date: number | string;
  y: (number | undefined)[];
}

export interface AreaChartDataType {
  date: number | string;
  y: number[];
}

export interface ScatterPlotDataType {
  x: number;
  y: number;
  radius?: number;
  color?: string;
  label?: string;
}
