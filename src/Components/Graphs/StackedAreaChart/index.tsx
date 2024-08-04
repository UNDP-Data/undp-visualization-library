import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { AreaChartDataType, ReferenceDataType } from '../../../Types';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { ColorLegend } from '../../Elements/ColorLegend';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: AreaChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  noOfXTicks?: number;
  dateFormat?: string;
  colorDomain: string[];
  backgroundColor?: string | boolean;
  padding?: string;
  colorLegendTitle?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  relativeHeight?: number;
  bottomMargin?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings?: [number | null, number | null];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  showColorScale?: boolean;
}

export function AreaChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    noOfXTicks,
    dateFormat,
    colorDomain,
    padding,
    backgroundColor,
    colorLegendTitle,
    leftMargin,
    rightMargin,
    topMargin,
    highlightAreaSettings,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    refValues,
    graphID,
    minValue,
    maxValue,
    graphDownload,
    dataDownload,
    highlightAreaColor,
    showColorScale,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);

  const areaColors = colors || UNDPColorModule.categoricalColors.colors;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        width: width ? 'fit-content' : '100%',
        flexGrow: width ? 0 : 1,
        marginLeft: 'auto',
        marginRight: 'auto',
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
            {showColorScale !== false ? (
              <ColorLegend
                colorDomain={colorDomain}
                colors={areaColors}
                colorLegendTitle={colorLegendTitle}
              />
            ) : null}
            <div
              style={{ flexGrow: 1, width: '100%', lineHeight: 0 }}
              ref={graphDiv}
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  colors={areaColors}
                  width={width || svgWidth}
                  height={
                    height ||
                    (relativeHeight
                      ? (width || svgWidth) * relativeHeight
                      : svgHeight)
                  }
                  dateFormat={dateFormat || 'yyyy'}
                  noOfXTicks={
                    checkIfNullOrUndefined(noOfXTicks)
                      ? 10
                      : (noOfXTicks as number)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 30
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? 20
                      : (rightMargin as number)
                  }
                  topMargin={
                    checkIfNullOrUndefined(topMargin)
                      ? 20
                      : (topMargin as number)
                  }
                  bottomMargin={
                    checkIfNullOrUndefined(bottomMargin)
                      ? 25
                      : (bottomMargin as number)
                  }
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  highlightAreaSettings={highlightAreaSettings || [null, null]}
                  refValues={refValues}
                  minValue={minValue}
                  maxValue={maxValue}
                  highlightAreaColor={
                    highlightAreaColor || UNDPColorModule.grays['gray-300']
                  }
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
