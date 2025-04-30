import { NumberValue } from 'd3-scale';

import { Colors } from '@/Components/ColorPalette';

interface Props {
  areaSettings: {
    coordinates: (Date | null | number)[];
    style?: React.CSSProperties;
    className?: string;
    color?: string;
    strokeWidth?: number;
  }[];
  width: number;
  height: number;
  scale: (value: Date | NumberValue) => number;
}

export function HighlightArea(props: Props) {
  const { areaSettings, width, height, scale } = props;
  return (
    <>
      {areaSettings.map((d, i) => (
        <g key={i}>
          {d.coordinates[0] === null && d.coordinates[1] === null ? null : (
            <g>
              <rect
                style={{
                  fill: d.color || Colors.light.grays['gray-300'],
                  strokeWidth: d.strokeWidth,
                  ...(d.style || {}),
                }}
                className={d.className}
                x={d.coordinates[0] ? scale(d.coordinates[0]) : 0}
                width={
                  d.coordinates[1]
                    ? scale(d.coordinates[1]) - (d.coordinates[0] ? scale(d.coordinates[0]) : 0)
                    : width - (d.coordinates[0] ? scale(d.coordinates[0]) : 0)
                }
                y={0}
                height={height}
              />
            </g>
          )}
        </g>
      ))}
    </>
  );
}

interface ScatterPlotProps {
  areaSettings: {
    coordinates: (Date | null | number)[];
    style?: React.CSSProperties;
    className?: string;
    color?: string;
    strokeWidth?: number;
  }[];
  width: number;
  height: number;
  scaleX: (value: Date | NumberValue) => number;
  scaleY: (value: Date | NumberValue) => number;
}

export function HighlightAreaForScatterPlot(props: ScatterPlotProps) {
  const { areaSettings, width, height, scaleX, scaleY } = props;
  return (
    <>
      {areaSettings.map((d, i) => (
        <g key={i}>
          {d.coordinates.filter(el => el === null).length === 4 ? null : (
            <g>
              <rect
                style={{
                  fill: d.color || Colors.light.grays['gray-300'],
                  strokeWidth: d.strokeWidth,
                  ...(d.style || {}),
                }}
                className={d.className}
                x={d.coordinates[0] ? scaleX(d.coordinates[0] as number) : 0}
                width={
                  d.coordinates[1]
                    ? scaleX(d.coordinates[1] as number) -
                      (d.coordinates[0] ? scaleX(d.coordinates[0] as number) : 0)
                    : width - (d.coordinates[0] ? scaleX(d.coordinates[0] as number) : 0)
                }
                y={d.coordinates[3] ? scaleY(d.coordinates[3] as number) : 0}
                height={
                  d.coordinates[2] !== null
                    ? scaleY(d.coordinates[2] as number) -
                      (d.coordinates[3] ? scaleY(d.coordinates[3] as number) : 0)
                    : height - (d.coordinates[3] ? height - scaleY(d.coordinates[3] as number) : 0)
                }
              />
            </g>
          )}
        </g>
      ))}
    </>
  );
}
