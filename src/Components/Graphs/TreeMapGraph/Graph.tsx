import { stratify, treemap } from 'd3-hierarchy';
import { useState } from 'react';
import { P } from '@undp-data/undp-design-system-react';
import { CSSObject, TreeMapDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { getTextColorBasedOnBgColor } from '../../../Utils/getTextColorBasedOnBgColor';
import { UNDPColorModule } from '../../ColorPalette';
import { string2HTML } from '../../../Utils/string2HTML';
import { Modal } from '../../Elements/Modal';

interface Props {
  data: TreeMapDataType[];
  colors: string[];
  colorDomain: string[];
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showLabels: boolean;
  showValues: boolean;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  selectedColor?: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;
  highlightedDataPoints: (string | number)[];
  mode: 'light' | 'dark';
  resetSelectionOnDoubleClick: boolean;
  tooltipBackgroundStyle: CSSObject;
  detailsOnClick?: string;
}

export function Graph(props: Props) {
  const {
    data,
    colors,
    leftMargin,
    width,
    height,
    colorDomain,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    selectedColor,
    showValues,
    suffix,
    prefix,
    highlightedDataPoints,
    onSeriesMouseClick,
    mode,
    resetSelectionOnDoubleClick,
    tooltipBackgroundStyle,
    detailsOnClick,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
  const [mouseClickData, setMouseClickData] = useState<any>(undefined);
  const [eventX, setEventX] = useState<number | undefined>(undefined);
  const [eventY, setEventY] = useState<number | undefined>(undefined);
  const margin = {
    top: topMargin,
    bottom: bottomMargin,
    left: leftMargin,
    right: rightMargin,
  };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;

  const treeMapData = [
    {
      id: 'root',
      parent: undefined,
      value: undefined,
      data: undefined,
    },
    ...data.map((d: TreeMapDataType) => ({
      id: d.label,
      value: d.size,
      parent: 'root',
      data: d,
    })),
  ];
  const treeData = stratify()
    .id((d: any) => d.id)
    .parentId((d: any) => d.parent)(treeMapData);
  treeData.sum((d: any) => d.value);
  const treeMapVizData = treemap().size([graphWidth, graphHeight]).padding(2)(
    treeData,
  );

  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
        direction='ltr'
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {treeMapVizData.children?.map((d, i) => {
            return (
              <g
                className='undp-viz-g-with-hover'
                key={i}
                opacity={
                  selectedColor
                    ? (d.data as any).data.color
                      ? colors[
                          colorDomain.indexOf((d.data as any).data.color)
                        ] === selectedColor
                        ? 1
                        : 0.3
                      : 0.3
                    : highlightedDataPoints.length !== 0
                    ? highlightedDataPoints.indexOf((d.data as any).id) !== -1
                      ? 0.85
                      : 0.3
                    : 0.85
                }
                transform={`translate(${d.x0},${d.y0})`}
                onMouseEnter={(event: any) => {
                  setMouseOverData((d.data as any).data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver((d.data as any).data);
                  }
                }}
                onClick={() => {
                  if (onSeriesMouseClick || detailsOnClick) {
                    if (
                      mouseClickData === (d.data as any).id &&
                      resetSelectionOnDoubleClick
                    ) {
                      setMouseClickData(undefined);
                      if (onSeriesMouseClick) onSeriesMouseClick(undefined);
                    } else {
                      setMouseClickData((d.data as any).id);
                      if (onSeriesMouseClick)
                        onSeriesMouseClick((d.data as any).data);
                    }
                  }
                }}
                onMouseMove={(event: any) => {
                  setMouseOverData((d.data as any).data);
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
              >
                <rect
                  key={i}
                  x={0}
                  y={0}
                  width={d.x1 - d.x0}
                  height={d.y1 - d.y0}
                  style={{
                    fill:
                      data.filter(el => el.color).length === 0
                        ? colors[0]
                        : !(d.data as any).data.color
                        ? UNDPColorModule[mode || 'light'].graphGray
                        : colors[
                            colorDomain.indexOf((d.data as any).data.color)
                          ],
                  }}
                />
                {d.x1 - d.x0 > 50 &&
                d.y1 - d.y0 > 25 &&
                (showLabels || showValues) ? (
                  <foreignObject
                    y={0}
                    x={0}
                    width={d.x1 - d.x0}
                    height={d.y1 - d.y0}
                  >
                    <div
                      className='flex flex-col gap-0.5 p-2 w-full'
                      style={{
                        color: getTextColorBasedOnBgColor(
                          data.filter(el => el.color).length === 0
                            ? colors[0]
                            : !(d.data as any).data.color
                            ? UNDPColorModule[mode || 'light'].graphGray
                            : colors[
                                colorDomain.indexOf((d.data as any).data.color)
                              ],
                        ),
                      }}
                    >
                      {showLabels ? (
                        <P
                          marginBottom='none'
                          size='sm'
                          leading='none'
                          className='w-full'
                          style={{
                            WebkitLineClamp:
                              d.y1 - d.y0 > 50
                                ? d.y1 - d.y0 > 100
                                  ? d.y1 - d.y0 > 150
                                    ? undefined
                                    : 3
                                  : 2
                                : 1,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: getTextColorBasedOnBgColor(
                              data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !(d.data as any).data.color
                                ? UNDPColorModule[mode || 'light'].graphGray
                                : colors[
                                    colorDomain.indexOf(
                                      (d.data as any).data.color,
                                    )
                                  ],
                            ),
                          }}
                        >
                          {(d.data as any).id}
                        </P>
                      ) : null}
                      {showValues ? (
                        <P
                          marginBottom='none'
                          size='sm'
                          leading='none'
                          className='font-bold w-full'
                          style={{
                            color: getTextColorBasedOnBgColor(
                              data.filter(el => el.color).length === 0
                                ? colors[0]
                                : !(d.data as any).data.color
                                ? UNDPColorModule[mode || 'light'].graphGray
                                : colors[
                                    colorDomain.indexOf(
                                      (d.data as any).data.color,
                                    )
                                  ],
                            ),
                          }}
                        >
                          {numberFormattingFunction(
                            (d.data as any).value,
                            prefix,
                            suffix,
                          )}
                        </P>
                      ) : null}
                    </div>
                  </foreignObject>
                ) : null}
              </g>
            );
          })}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip
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
