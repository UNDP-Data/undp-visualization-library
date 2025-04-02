import { cn } from '@undp-data/undp-design-system-react';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';

interface Props {
  label?: string;
  labelPos?: { x: number; y: number };
  y1: number;
  x1: number;
  y2: number;
  x2: number;
  classNames?: { axis?: string; label?: string };
  styles?: { axis?: React.CSSProperties; label?: React.CSSProperties };
}

export function Axis(props: Props) {
  const { label, x2, y2, x1, y1, classNames, styles, labelPos } = props;
  return (
    <>
      <line
        y1={y1}
        y2={y2}
        x1={x1}
        x2={x2}
        style={styles?.axis}
        className={cn(
          'stroke-1 stroke-primary-gray-700 dark:stroke-primary-gray-300',
          classNames?.axis,
        )}
      />
      {!checkIfNullOrUndefined(label) ? (
        <text
          x={labelPos?.x}
          y={labelPos?.y}
          style={{
            textAnchor: 'start',
            ...(styles?.label || ''),
          }}
          className={cn(
            'fill-primary-gray-700 dark:fill-primary-gray-300 text-xs',
            classNames?.label,
          )}
        >
          {label}
        </text>
      ) : null}
    </>
  );
}
