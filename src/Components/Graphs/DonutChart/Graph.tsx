import { pie, arc } from 'd3-shape';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { DonutChartDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';

interface Props {
  mainText?: string;
  radius: number;
  colors: string[];
  subNote?: string;
  strokeWidth: number;
  data: DonutChartDataType[];
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
}

export function Graph(props: Props) {
  const {
    mainText,
    data,
    radius,
    colors,
    subNote,
    strokeWidth,
    tooltip,
    onSeriesMouseOver,
    onSeriesMouseClick,
  } = props;
  const pieData = pie()
    .startAngle(0)
    .value((d: any) => d.value);
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  return (
    <>
      <svg
        width={`${radius * 2}px`}
        height={`${radius * 2}px`}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <g transform={`translate(${radius} ${radius})`}>
          <circle
            style={{
              fillOpacity: 0,
              stroke: 'var(--gray-500)',
              strokeWidth,
            }}
            cx={0}
            cy={0}
            r={radius - (strokeWidth + 2) / 2}
          />
          {pieData(data as any).map((d, i) => (
            <path
              key={i}
              d={
                arc()({
                  innerRadius: radius - strokeWidth,
                  outerRadius: radius,
                  startAngle: d.startAngle,
                  endAngle: d.endAngle,
                }) as string
              }
              style={{
                fill: colors[i],
                opacity: mouseOverData
                  ? mouseOverData.label === (d.data as any).label
                    ? 1
                    : 0.3
                  : 1,
              }}
              onMouseEnter={event => {
                setMouseOverData(d.data);
                setEventY(event.clientY);
                setEventX(event.clientX);
                if (onSeriesMouseOver) {
                  onSeriesMouseOver(d);
                }
              }}
              onClick={() => {
                if (onSeriesMouseClick) {
                  if (isEqual(mouseClickData, d.data)) {
                    setMouseClickData(undefined);
                    onSeriesMouseClick(undefined);
                  } else {
                    setMouseClickData(d.data);
                    onSeriesMouseClick(d.data);
                  }
                }
              }}
              onMouseMove={event => {
                setMouseOverData(d.data);
                setEventY(event.clientY);
                setEventX(event.clientX);
              }}
              onMouseLeave={() => {
                setMouseOverData(undefined);
                setEventX(undefined);
                setEventY(undefined);
                if (onSeriesMouseOver) {
                  onSeriesMouseOver(undefined);
                }
              }}
            />
          ))}
          {mainText ? (
            <text
              x={0}
              y={0}
              textAnchor='middle'
              fontSize='2.813rem'
              fontWeight='bold'
              style={{ fill: 'var(--black)', fontFamily: 'var(--fontFamily)' }}
            >
              {mainText}
            </text>
          ) : null}
          {subNote ? (
            <text
              x={0}
              y={30}
              textAnchor='middle'
              fontSize='1.25rem'
              fontWeight='bold'
              style={{ fill: 'var(--black)', fontFamily: 'var(--fontFamily)' }}
            >
              {subNote}
            </text>
          ) : null}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
