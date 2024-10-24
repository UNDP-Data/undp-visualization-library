import { pack, stratify } from 'd3-hierarchy';

import { useState } from 'react';
import { TreeMapDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { getTextColorBasedOnBgColor } from '../../../Utils/getTextColorBasedOnBgColor';
import { UNDPColorModule } from '../../ColorPalette';

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
  highlightedDataPoints: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'light' | 'dark';
}

export function Graph(props: Props) {
  const {
    data,
    colors,
    leftMargin,
    width,
    height,
    colorDomain,
    selectedColor,
    rightMargin,
    topMargin,
    bottomMargin,
    showLabels,
    tooltip,
    onSeriesMouseOver,
    showValues,
    suffix,
    prefix,
    highlightedDataPoints,
    onSeriesMouseClick,
    rtl,
    language,
    mode,
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
  const circlePackingData = pack().size([graphWidth, graphHeight]).padding(2)(
    treeData,
  );
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox={`0 0 ${width} ${height}`}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {circlePackingData.children?.map((d, i) => {
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
                transform={`translate(${d.x},${d.y})`}
                onMouseEnter={(event: any) => {
                  setMouseOverData((d.data as any).data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver((d.data as any).data);
                  }
                }}
                onMouseMove={(event: any) => {
                  setMouseOverData((d.data as any).data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                }}
                onClick={() => {
                  if (onSeriesMouseClick) {
                    if (mouseClickData === (d.data as any).id) {
                      setMouseClickData(undefined);
                      onSeriesMouseClick(undefined);
                    } else {
                      setMouseClickData((d.data as any).id);
                      onSeriesMouseClick((d.data as any).data);
                    }
                  }
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
                <circle
                  key={i}
                  cx={0}
                  cy={0}
                  r={d.r}
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
                {d.r > 20 && (showLabels || showValues) ? (
                  <foreignObject
                    y={0 - d.r}
                    x={0 - d.r}
                    width={2 * d.r}
                    height={2 * d.r}
                  >
                    <div
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
                        padding: '0 0.25rem',
                      }}
                    >
                      {showLabels ? (
                        <p
                          className={`${
                            rtl
                              ? `undp-viz-typography-${language || 'ar'} `
                              : ''
                          }undp-viz-typography`}
                          style={{
                            fontSize: `${Math.min(
                              Math.max(Math.round(d.r / 4), 8),
                              20,
                            )}px`,
                            marginBottom: 0,
                            textAlign: 'center',
                            lineHeight: '1',
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
                        </p>
                      ) : null}
                      {showValues ? (
                        <p
                          className='undp-viz-typography'
                          style={{
                            fontSize: `${Math.min(
                              Math.max(Math.round(d.r / 4), 10),
                              20,
                            )}px`,
                            textAlign: 'center',
                            marginBottom: 0,
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
                            prefix || '',
                            suffix || '',
                          )}
                        </p>
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
          rtl={rtl}
          language={language}
          data={mouseOverData}
          body={tooltip}
          xPos={eventX}
          yPos={eventY}
          mode={mode}
        />
      ) : null}
    </>
  );
}
