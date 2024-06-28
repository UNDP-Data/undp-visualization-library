import { stratify, treemap } from 'd3-hierarchy';
import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState } from 'react';
import styled from 'styled-components';
import { TreeMapDataType } from '../../../Types';
import { Tooltip } from '../../Elements/Tooltip';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';

interface Props {
  data: TreeMapDataType[];
  colors: string[];
  colorDomain: string[];
  leftMargin: number;
  rightMargin: number;
  topMargin: number;
  bottomMargin: number;
  showLabel: boolean;
  showValue: boolean;
  width: number;
  height: number;
  suffix: string;
  prefix: string;
  selectedColor?: string;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

const G = styled.g`
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
  }
`;

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
    showLabel,
    tooltip,
    onSeriesMouseOver,
    selectedColor,
    showValue,
    suffix,
    prefix,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<any>(undefined);
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
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {treeMapVizData.children?.map((d, i) => {
            return (
              <G
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
                    : 0.85
                }
                transform={`translate(${d.x0},${d.y0})`}
                onMouseEnter={(event: any) => {
                  setMouseOverData((d.data as any).data);
                  setEventY(event.clientY);
                  setEventX(event.clientX);
                  if (onSeriesMouseOver) {
                    onSeriesMouseOver((d.data as any).date);
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
                        ? UNDPColorModule.graphGray
                        : colors[
                            colorDomain.indexOf((d.data as any).data.color)
                          ],
                  }}
                />
                {d.x1 - d.x0 > 50 &&
                d.y1 - d.y0 > 25 &&
                (showLabel || showValue) ? (
                  <foreignObject
                    y={0}
                    x={0}
                    width={d.x1 - d.x0}
                    height={d.y1 - d.y0}
                  >
                    <div
                      style={{
                        fill: 'var(--white)',
                        fontFamily: 'var(--fontFamily)',
                        textAnchor: 'middle',
                        whiteSpace: 'normal',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        padding: 'var(--spacing-03)',
                      }}
                    >
                      {showLabel ? (
                        <p
                          className='undp-typography margin-bottom-00'
                          style={{
                            fontSize: '12px',
                            lineHeight: '1',
                            color: 'var(--white)',
                          }}
                        >
                          {(d.data as any).id}
                        </p>
                      ) : null}
                      {showValue ? (
                        <p
                          className='undp-typography margin-bottom-00'
                          style={{
                            fontSize: '12px',
                            color: 'var(--white)',
                            fontWeight: 'bold',
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
              </G>
            );
          })}
        </g>
      </svg>
      {mouseOverData && tooltip && eventX && eventY ? (
        <Tooltip body={tooltip(mouseOverData)} xPos={eventX} yPos={eventY} />
      ) : null}
    </>
  );
}
