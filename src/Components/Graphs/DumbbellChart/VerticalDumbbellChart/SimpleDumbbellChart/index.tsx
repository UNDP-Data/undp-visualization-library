import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';
import { Graph } from './Graph';
import { DumbbellChartDataType } from '../../../../../Types';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { ColorLegendWithMouseOver } from '../../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: DumbbellChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  barPadding?: number;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  radius?: number;
  relativeHeight?: number;
  showValues?: boolean;
  showLabels?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxPositionValue?: number;
  minPositionValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  suffix?: string;
  prefix?: string;
  sortParameter?: number | 'diff';
  arrowConnector?: boolean;
  connectorStrokeWidth?: number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
}

export function VerticalDumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    barPadding,
    showTicks,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor,
    radius,
    tooltip,
    showLabels,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    suffix,
    prefix,
    maxPositionValue,
    minPositionValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    showValues,
    sortParameter,
    arrowConnector,
    connectorStrokeWidth,
    rtl,
    language,
    minHeight,
    mode,
    maxBarThickness,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 620);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [graphDiv?.current, width]);

  const dotColors =
    colors || UNDPColorModule[mode || 'light'].categoricalColors.colors;

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
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
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
              rtl={rtl}
              language={language}
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
              mode={mode || 'light'}
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
            <ColorLegendWithMouseOver
              rtl={rtl}
              language={language}
              width={width}
              colorDomain={colorDomain}
              colors={dotColors}
              colorLegendTitle={colorLegendTitle}
              setSelectedColor={setSelectedColor}
              showNAColor={false}
              mode={mode || 'light'}
            />
            <div
              style={{
                flexGrow: 1,
                width: '100%',
                lineHeight: 0,
                display: 'flex',
                justifyContent: 'center',
              }}
              ref={graphDiv}
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={
                    sortParameter !== undefined
                      ? sortParameter === 'diff'
                        ? sortBy(data, d =>
                            checkIfNullOrUndefined(d.x[d.x.length - 1]) ||
                            checkIfNullOrUndefined(d.x[0])
                              ? -Infinity
                              : (d.x[d.x.length - 1] as number) -
                                (d.x[0] as number),
                          )
                        : sortBy(data, d =>
                            checkIfNullOrUndefined(d.x[sortParameter])
                              ? -Infinity
                              : d.x[sortParameter],
                          )
                      : data
                  }
                  dotColors={dotColors}
                  width={width || svgWidth}
                  height={
                    height ||
                    (relativeHeight
                      ? minHeight
                        ? (width || svgWidth) * relativeHeight > minHeight
                          ? (width || svgWidth) * relativeHeight
                          : minHeight
                        : (width || svgWidth) * relativeHeight
                      : svgHeight)
                  }
                  radius={!radius ? 3 : radius}
                  barPadding={
                    checkIfNullOrUndefined(barPadding)
                      ? 0.25
                      : (barPadding as number)
                  }
                  showTicks={
                    checkIfNullOrUndefined(showTicks)
                      ? true
                      : (showTicks as boolean)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 20
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
                  truncateBy={
                    checkIfNullOrUndefined(truncateBy)
                      ? 999
                      : (truncateBy as number)
                  }
                  showLabels={
                    checkIfNullOrUndefined(showLabels)
                      ? true
                      : (showLabels as boolean)
                  }
                  showValues={
                    checkIfNullOrUndefined(showValues)
                      ? true
                      : (showValues as boolean)
                  }
                  tooltip={tooltip}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                  onSeriesMouseOver={onSeriesMouseOver}
                  maxPositionValue={maxPositionValue}
                  minPositionValue={minPositionValue}
                  onSeriesMouseClick={onSeriesMouseClick}
                  selectedColor={selectedColor}
                  arrowConnector={
                    checkIfNullOrUndefined(arrowConnector)
                      ? false
                      : (arrowConnector as boolean)
                  }
                  connectorStrokeWidth={
                    checkIfNullOrUndefined(connectorStrokeWidth)
                      ? 2
                      : (connectorStrokeWidth as number)
                  }
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
                  mode={mode || 'light'}
                  maxBarThickness={maxBarThickness}
                />
              ) : null}
            </div>
          </div>
          {source || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              source={source}
              sourceLink={sourceLink}
              footNote={footNote}
              width={width}
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
