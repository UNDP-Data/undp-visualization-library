import uniqBy from 'lodash.uniqby';
import UNDPColorModule from '@undp-data/undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { ReferenceDataType, ScatterPlotDataType } from '../../../Types';
import { Graph } from './Graph';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { ColorLegendWithMouseOver } from '../../Elements/ColorLegendWithMouseOver';

interface Props {
  data: ScatterPlotDataType[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  showLabels?: boolean;
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  pointRadius?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  refXValue?: ReferenceDataType;
  refYValue?: ReferenceDataType;
  highlightedDataPoints?: (string | number)[];
  highlightAreaSettings?: [
    number | null,
    number | null,
    number | null,
    number | null,
  ];
  showColorScale?: boolean;
  graphID?: string;
}

export function ScatterPlot(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    showLabels,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    pointRadius,
    xAxisTitle,
    yAxisTitle,
    padding,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    refXValue,
    refYValue,
    highlightAreaSettings,
    showColorScale,
    highlightedDataPoints,
    graphID,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: width ? 0 : 1,
        margin: 'auto',
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
      id={graphID}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 'var(--spacing-05)',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
            width={width}
          />
        ) : null}
        {showColorScale !== false &&
        data.filter(el => el.color).length !== 0 ? (
          <ColorLegendWithMouseOver
            width={width}
            colorLegendTitle={colorLegendTitle}
            colors={
              (colors as string[] | undefined) ||
              UNDPColorModule.categoricalColors.colors
            }
            colorDomain={
              colorDomain ||
              (uniqBy(
                data.filter(el => el.color),
                'color',
              ).map(d => d.color) as string[])
            }
            setSelectedColor={setSelectedColor}
            showNAColor
          />
        ) : null}
        <div
          style={{
            flexGrow: 1,
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            lineHeight: 0,
          }}
          ref={graphDiv}
        >
          {(width || svgWidth) && (height || svgHeight) ? (
            <Graph
              data={data}
              width={width || svgWidth}
              height={
                height ||
                (relativeHeight
                  ? (width || svgWidth) * relativeHeight
                  : svgHeight)
              }
              colorDomain={
                data.filter(el => el.color).length === 0
                  ? []
                  : colorDomain ||
                    (uniqBy(
                      data.filter(el => el.color),
                      'color',
                    ).map(d => d.color) as string[])
              }
              colors={
                data.filter(el => el.color).length === 0
                  ? colors
                    ? [colors as string]
                    : ['var(--blue-600)']
                  : (colors as string[] | undefined) ||
                    UNDPColorModule.categoricalColors.colors
              }
              xAxisTitle={xAxisTitle || 'X Axis'}
              yAxisTitle={yAxisTitle || 'Y Axis'}
              refXValue={refXValue}
              refYValue={refYValue}
              showLabels={
                checkIfNullOrUndefined(showLabels)
                  ? false
                  : (showLabels as boolean)
              }
              pointRadius={
                checkIfNullOrUndefined(pointRadius)
                  ? 5
                  : (pointRadius as number)
              }
              leftMargin={
                checkIfNullOrUndefined(leftMargin) ? 50 : (leftMargin as number)
              }
              rightMargin={
                checkIfNullOrUndefined(rightMargin)
                  ? 20
                  : (rightMargin as number)
              }
              topMargin={
                checkIfNullOrUndefined(topMargin) ? 20 : (topMargin as number)
              }
              bottomMargin={
                checkIfNullOrUndefined(bottomMargin)
                  ? 50
                  : (bottomMargin as number)
              }
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
              highlightAreaSettings={
                highlightAreaSettings || [null, null, null, null]
              }
              highlightedDataPoints={highlightedDataPoints || []}
              selectedColor={selectedColor}
            />
          ) : null}
        </div>
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
            width={width}
          />
        ) : null}
      </div>
    </div>
  );
}
