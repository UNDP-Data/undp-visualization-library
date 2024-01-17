export interface TimeSeriesProps {
  year: number;
  value: number;
}

export interface BarGraphProps {
  barTitle: string | number;
  value: number;
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
