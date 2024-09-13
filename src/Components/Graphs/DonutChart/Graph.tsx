import { pie, arc } from 'd3-shape';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { DonutChartDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  mainText?: string;
  radius: number;
  colors: string[];
  subNote?: string;
  strokeWidth: number;
  data: DonutChartDataType[];
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  colorDomain: string[];
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
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
    colorDomain,
    rtl,
    language,
  } = props;
  const pieData = pie()
    .sort(null)
    .startAngle(0)
    .value((d: any) => d.size);
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
          {mainText || subNote ? (
            <foreignObject
              y={0 - (radius - strokeWidth)}
              x={0 - (radius - strokeWidth)}
              width={2 * (radius - strokeWidth)}
              height={2 * (radius - strokeWidth)}
            >
              <div
                style={{
                  fill: UNDPColorModule.grays.black,
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
                  textAnchor: 'middle',
                  whiteSpace: 'normal',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 'inherit',
                  padding: '0 1rem',
                }}
              >
                {mainText ? (
                  <h2
                    className='undp-viz-typography'
                    style={{
                      lineHeight: '1',
                      textAlign: 'center',
                      marginBottom: 0,
                    }}
                  >
                    {mainText}
                  </h2>
                ) : null}
                {subNote ? (
                  <p
                    className='undp-viz-typography'
                    style={{
                      lineHeight: '1',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      marginBottom: 0,
                    }}
                  >
                    {subNote}
                  </p>
                ) : null}
              </div>
            </foreignObject>
          ) : null}
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
                fill:
                  colorDomain.indexOf((d.data as any).label) !== -1
                    ? colors[
                        colorDomain.indexOf((d.data as any).label) %
                          colors.length
                      ]
                    : UNDPColorModule.graphGray,
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
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
          rtl={rtl}
          language={language}
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
        />
      ) : null}
    </>
  );
}
