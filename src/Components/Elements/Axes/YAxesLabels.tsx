import { cn } from '@undp/design-system-react';

interface Props {
  value: number | string;
  y: number;
  x: number;
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
  alignment?: 'left' | 'right' | 'center';
}

export function YAxesLabels(props: Props) {
  const { value, y, x, style, className, width, height, alignment = 'right' } = props;
  return (
    <foreignObject y={y} x={x} width={width} height={height}>
      <div className='flex flex-col justify-center h-inherit'>
        <p
          className={cn(
            'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs m-0 py-0 px-1.5',
            `text-${alignment}`,
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
