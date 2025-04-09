export const STYLE_OBJECT = `{
  title?: React.CSSProperties;
  footnote?: React.CSSProperties;
  source?: React.CSSProperties;
  description?: React.CSSProperties;
  graphBackground?: React.CSSProperties;
  tooltip?: React.CSSProperties;
  xAxis?: {
    gridLines?: React.CSSProperties;
    labels?: React.CSSProperties;
    title?: React.CSSProperties;
    axis?: React.CSSProperties;
  };
  yAxis?: {
    gridLines?: React.CSSProperties;
    labels?: React.CSSProperties;
    title?: React.CSSProperties;
    axis?: React.CSSProperties;
  };
  graphObjectValues?: React.CSSProperties;
  dataConnectors?: React.CSSProperties;
  mouseOverLine?: React.CSSProperties;
  regLine?: React.CSSProperties;
  dataCard?: React.CSSProperties;
}`;

export const CLASS_NAME_OBJECT = `{
  title?: string;
  footnote?: string;
  source?: string;
  description?: string;
  graphBackground?: string;
  tooltip?: string;
  xAxis?: {
    gridLines?: string;
    labels?: string;
    title?: string;
    axis?: string;
  };
  yAxis?: {
    gridLines?: string;
    labels?: string;
    title?: string;
    axis?: string;
  };
  graphObjectValues?: string;
  dataConnectors?: string;
  mouseOverLine?: string;
  regLine?: string;
  dataCard?: string;
}`;

export const REF_VALUE_OBJECT = `{
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
}`;

export const SOURCE_OBJECT = `{
  source: string; 
  link?: string; 
}`;

export const ANNOTATION_OBJECT = `{
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
}`;

export const CUSTOM_HIGHLIGHT_AREA_OBJECT = `{
  coordinates: (number | string)[];
  style?: React.CSSProperties;
  className?: string;
  color?: string;
  strokeWidth?: number;
}`;

export const LANGUAGE_OPTIONS = [
  'en',
  'ar',
  'az',
  'bn',
  'cy',
  'he',
  'hi',
  'jp',
  'ka',
  'km',
  'ko',
  'my',
  'ne',
  'zh',
  'custom',
];
