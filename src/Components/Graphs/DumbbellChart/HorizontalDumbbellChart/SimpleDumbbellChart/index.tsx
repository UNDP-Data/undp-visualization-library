import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';
import { Graph } from './Graph';
import {
  BackgroundStyleDataType,
  CSSObject,
  DumbbellChartDataType,
  SourcesDataType,
} from '../../../../../Types';
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
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  barPadding?: number;
  showValues?: boolean;
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
  showLabels?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxPositionValue?: number;
  minPositionValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  sortParameter?: number | 'diff';
  arrowConnector?: boolean;
  connectorStrokeWidth?: number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
  maxNumberOfBars?: number;
  minBarThickness?: number;
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
}

export function HorizontalDumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors = UNDPColorModule.light.categoricalColors.colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    leftMargin = 100,
    rightMargin = 40,
    topMargin = 20,
    bottomMargin = 10,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    radius = 3,
    showLabels = true,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    suffix = '',
    prefix = '',
    maxPositionValue,
    minPositionValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    showValues = true,
    sortParameter,
    arrowConnector = false,
    connectorStrokeWidth = 2,
    rtl = false,
    language = 'en',
    minHeight = 0,
    mode = 'light',
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    tooltipBackgroundStyle = {
      backgroundColor: UNDPColorModule[mode].grays['gray-200'],
      border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
      maxWidth: '24rem',
      padding: '0.5rem',
    },
    detailsOnClick,
    barAxisTitle,
    noOfTicks = 5,
    valueColor,
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
      setSvgHeight(height || entries[0].target.clientHeight || 480);
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);

  return (
    <div
      style={{
        ...backgroundStyle,
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
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      ref={graphParentDiv}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is a dumbbell chart that shows comparisons between two or more data points across categories. ${
          graphDescription ? ` ${graphDescription}` : ''
        }`
      }
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
              mode={mode}
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
              colors={colors}
              colorLegendTitle={colorLegendTitle}
              setSelectedColor={setSelectedColor}
              showNAColor={false}
              mode={mode}
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
              aria-label='Graph area'
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
                            .reverse()
                            .filter((_d, i) =>
                              maxNumberOfBars ? i < maxNumberOfBars : true,
                            )
                        : sortBy(data, d =>
                            checkIfNullOrUndefined(d.x[sortParameter])
                              ? -Infinity
                              : d.x[sortParameter],
                          )
                            .reverse()
                            .filter((_d, i) =>
                              maxNumberOfBars ? i < maxNumberOfBars : true,
                            )
                      : data.filter((_d, i) =>
                          maxNumberOfBars ? i < maxNumberOfBars : true,
                        )
                  }
                  dotColors={colors}
                  width={width || svgWidth}
                  height={Math.max(
                    minHeight,
                    height ||
                      (relativeHeight
                        ? minHeight
                          ? (width || svgWidth) * relativeHeight > minHeight
                            ? (width || svgWidth) * relativeHeight
                            : minHeight
                          : (width || svgWidth) * relativeHeight
                        : svgHeight),
                  )}
                  suffix={suffix}
                  prefix={prefix}
                  radius={radius}
                  barPadding={barPadding}
                  showTicks={showTicks}
                  leftMargin={leftMargin}
                  rightMargin={rightMargin}
                  topMargin={topMargin}
                  bottomMargin={bottomMargin}
                  truncateBy={truncateBy}
                  showLabels={showLabels}
                  showValues={showValues}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  maxPositionValue={maxPositionValue}
                  minPositionValue={minPositionValue}
                  onSeriesMouseClick={onSeriesMouseClick}
                  selectedColor={selectedColor}
                  arrowConnector={arrowConnector}
                  connectorStrokeWidth={connectorStrokeWidth}
                  rtl={rtl}
                  language={language}
                  mode={mode}
                  maxBarThickness={maxBarThickness}
                  minBarThickness={minBarThickness}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  tooltipBackgroundStyle={tooltipBackgroundStyle}
                  detailsOnClick={detailsOnClick}
                  barAxisTitle={barAxisTitle}
                  noOfTicks={noOfTicks}
                  valueColor={valueColor}
                />
              ) : null}
            </div>
          </div>
          {sources || footNote ? (
            <GraphFooter
              rtl={rtl}
              language={language}
              sources={sources}
              footNote={footNote}
              width={width}
              mode={mode}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
