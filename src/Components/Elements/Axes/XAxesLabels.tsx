import { cn } from '@undp/design-system-react';

interface Props {
  value: number | string;
  y: number;
  x: number;
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
  alignment?: 'top' | 'bottom';
}

export function XAxesLabels(props: Props) {
  const { value, y, x, style, className, width, height, alignment = 'top' } = props;
  return (
    <foreignObject y={y} x={x} width={width} height={height}>
      <div
        className={`flex flex-col items-center h-inherit ${
          alignment === 'top' ? 'justify-start' : 'justify-end'
        }`}
      >
        <p
          className={cn(
            'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs m-0 py-0 px-1.5 text-center',
            className,
          )}
          style={style}
        >
          {value}
        </p>
      </div>
    </foreignObject>
  );
}
