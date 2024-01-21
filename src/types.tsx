export interface TimeSeriesProps {
  year: number;
  value: number;
}

export interface VerticalBarGraphDataType {
  label: string;
  height: number;
  color?: string | number;
}

export interface HorizontalBarGraphDataType {
  width: number;
  label: string;
  color?: string | number;
}

export interface DonutChartDataType {
  value: number;
  label: string;
}

export interface ValueProps {
  category: string;
  value: number;
}

export interface StackedBarGraphProps {
  barTitle: string | number;
  values: ValueProps[];
  total: number;
}

export interface SlopeChartProps {
  category: string | number;
  color: string;
  values: [ValueProps, ValueProps];
}
