import uniqBy from 'lodash.uniqby';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { BeeSwarmChartDataType, ReferenceDataType } from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: BeeSwarmChartDataType[];
  colors?: string | string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showLabel?: boolean;
  showColorScale?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  pointRadius?: number;
  pointRadiusMaxValue?: number;
  maxPositionValue?: number;
  minPositionValue?: number;
  highlightedDataPoints?: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
}

export function HorizontalBeeSwarmChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    showTicks,
    leftMargin,
    rightMargin,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor,
    topMargin,
    bottomMargin,
    showLabel,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale,
    graphID,
    pointRadius,
    pointRadiusMaxValue,
    maxPositionValue,
    minPositionValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
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
        width: width ? 'fit-content' : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        height: 'inherit',
        flexGrow: width ? 0 : 1,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule.grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      ref={graphParentDiv}
    >
      <div
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: '1rem',
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >
          {graphTitle || graphDescription || graphDownload || dataDownload ? (
            <GraphHeader
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={width}
              graphDownload={graphDownload ? graphParentDiv.current : undefined}
              dataDownload={
                dataDownload &&
                data.map(d => d.data).filter(d => d !== undefined).length > 0
                  ? data.map(d => d.data).filter(d => d !== undefined)
                  : null
              }
            />
          ) : null}
          <div
            style={{
              flexGrow: 1,
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
            }}
          >
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
                width: '100%',
              }}
              ref={graphDiv}
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  circleColors={
                    data.filter(el => el.color).length === 0
                      ? colors
                        ? [colors as string]
                        : [UNDPColorModule.primaryColors['blue-600']]
                      : (colors as string[] | undefined) ||
                        UNDPColorModule.categoricalColors.colors
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
                  width={width || svgWidth}
                  selectedColor={selectedColor}
                  height={
                    height ||
                    (relativeHeight
                      ? (width || svgWidth) * relativeHeight
                      : svgHeight)
                  }
                  showTicks={
                    checkIfNullOrUndefined(showTicks)
                      ? true
                      : (showTicks as boolean)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 10
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? 10
                      : (rightMargin as number)
                  }
                  topMargin={
                    checkIfNullOrUndefined(topMargin)
                      ? 25
                      : (topMargin as number)
                  }
                  bottomMargin={
                    checkIfNullOrUndefined(bottomMargin)
                      ? 10
                      : (bottomMargin as number)
                  }
                  showLabel={
                    checkIfNullOrUndefined(showLabel)
                      ? true
                      : (showLabel as boolean)
                  }
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  refValues={refValues}
                  startFromZero={false}
                  pointRadius={
                    checkIfNullOrUndefined(pointRadius)
                      ? 5
                      : (pointRadius as number)
                  }
                  pointRadiusMaxValue={pointRadiusMaxValue}
                  maxPositionValue={maxPositionValue}
                  minPositionValue={minPositionValue}
                  highlightedDataPoints={highlightedDataPoints || []}
                  onSeriesMouseClick={onSeriesMouseClick}
                />
              ) : null}
            </div>
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
    </div>
  );
}
