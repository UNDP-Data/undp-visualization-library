import { pie, arc } from 'd3-shape';
import { useState } from 'react';
import isEqual from 'lodash.isequal';
import { H2, Modal, P } from '@undp-data/undp-design-system-react';
import { CSSObject, DonutChartDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { UNDPColorModule } from '../../ColorPalette';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { string2HTML } from '../../../Utils/string2HTML';

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
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle?: CSSObject;
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
        direction='ltr'
      >
        <g transform={`translate(${radius} ${radius})`}>
          {mainText || subNote ? (
            <foreignObject
              y={0 - (radius - strokeWidth)}
              x={0 - (radius - strokeWidth)}
              width={2 * (radius - strokeWidth)}
              height={2 * (radius - strokeWidth)}
            >
              <div className='flex flex-col gap-0.5 justify-center items-center h-inherit py-0 px-4'>
                {mainText ? (
                  <H2
                    marginBottom='none'
                    className='text-primary-gray-700 dark:text-primary-gray-100 leading-none text-center'
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
                  </H2>
                ) : null}
                {subNote ? (
                  <P
                    marginBottom='none'
                    size='base'
                    leading='none'
                    className='text-primary-gray-700 dark:text-primary-gray-100 text-center font-bold'
                  >
                    {subNote}
                  </P>
                ) : typeof mainText === 'string' || !mainText ? null : (
                  <P
                    size='base'
                    marginBottom='none'
                    leading='none'
                    className='text-primary-gray-700 dark:text-primary-gray-100 text-center font-bold'
                  >
                    {mainText.label}
                  </P>
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
                    : UNDPColorModule.gray,
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
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          backgroundStyle={tooltipBackgroundStyle}
        />
      ) : null}
      {detailsOnClick ? (
        <Modal
          open={mouseClickData !== undefined}
          onClose={() => {
            setMouseClickData(undefined);
          }}
        >
          <div
            className='m-0'
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
