import { cn } from '@undp-data/undp-design-system-react';

interface Props {
  color?: string;
  y1: number;
  y2: number;
  x1: number;
  x2: number;
  className?: string;
  style?: React.CSSProperties;
}

export function RegressionLine(props: Props) {
  const {
    color, x1, x2, y1, y2, className, style, 
  } = props;
  return (
    <g>
      <line
        className={cn(
          'undp-ref-line',
          !color
            ? 'stroke-primary-gray-700 dark:stroke-primary-gray-300'
            : undefined,
          className,
        )}
        style={{
          ...(color && { stroke: color }),
          fill: 'none',
          ...(style || {}),
        }}
        y1={y1}
        y2={y2}
        x1={x1}
        x2={x2}
      />
    </g>
  );
}
