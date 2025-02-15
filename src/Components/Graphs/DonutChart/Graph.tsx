import { pie, arc } from 'd3-shape';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { CSSObject, DonutChartDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { UNDPColorModule } from '../../ColorPalette';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { string2HTML } from '../../../Utils/string2HTML';
import { Modal } from '../../Elements/Modal';

interface Props {
  mainText?: string | { label: string; suffix?: string; prefix?: string };
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
  mode: 'light' | 'dark';
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle: CSSObject;
  detailsOnClick?: string;
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
    mode,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
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
                  fill: UNDPColorModule[mode || 'light'].grays.black,
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
                    className={`${
                      rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                    }undp-viz-typography`}
                    style={{
                      lineHeight: '1',
                      textAlign: 'center',
                      marginBottom: 0,
                      color: UNDPColorModule[mode || 'light'].grays.black,
                    }}
                  >
                    {typeof mainText === 'string'
                      ? mainText
                      : data.findIndex(d => d.label === mainText.label) !== -1
                      ? numberFormattingFunction(
                          data[data.findIndex(d => d.label === mainText.label)]
                            .size,
                          mainText.prefix,
                          mainText.suffix,
                        )
                      : 'NA'}
                  </h2>
                ) : null}
                {subNote ? (
                  <p
                    className={`${
                      rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                    }undp-viz-typography`}
                    style={{
                      lineHeight: '1',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      marginBottom: 0,
                      color: UNDPColorModule[mode || 'light'].grays.black,
                    }}
                  >
                    {subNote}
                  </p>
                ) : typeof mainText === 'string' || !mainText ? null : (
                  <p
                    className={`${
                      rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                    }undp-viz-typography`}
                    style={{
                      lineHeight: '1',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      marginBottom: 0,
                      color: UNDPColorModule[mode || 'light'].grays.black,
                    }}
                  >
                    {mainText.label}
                  </p>
                )}
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
                    : UNDPColorModule[mode || 'light'].graphGray,
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
                if (onSeriesMouseClick || detailsOnClick) {
                  if (
                    isEqual(mouseClickData, d.data) &&
                    resetSelectionOnDoubleClick
                  ) {
                    setMouseClickData(undefined);
                    if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                  } else {
                    setMouseClickData(d.data);
                    if (onSeriesMouseClick) onSeriesMouseClick(d.data);
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
          mode={mode}
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
      {detailsOnClick ? (
        <Modal
          isOpen={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            style={{ margin: 0 }}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: string2HTML(detailsOnClick, mouseClickData),
            }}
          />
        </Modal>
      ) : null}
    </>
  );
}
