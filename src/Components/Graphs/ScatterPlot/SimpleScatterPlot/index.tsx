import uniqBy from 'lodash.uniqby';
import { useState, useRef, useEffect } from 'react';
import {
  ReferenceDataType,
  ScatterPlotDataType,
  AnnotationSettingsDataType,
  CustomHighlightAreaSettingsDataType,
  SourcesDataType,
  BackgroundStyleDataType,
  CSSObject,
} from '../../../../Types';
import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: ScatterPlotDataType[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  showLabels?: boolean;
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  radius?: number;
  xAxisTitle?: string;
  yAxisTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refXValues?: ReferenceDataType[];
  refYValues?: ReferenceDataType[];
  highlightedDataPoints?: (string | number)[];
  highlightAreaSettings?: [
    number | null,
    number | null,
    number | null,
    number | null,
  ];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  highlightAreaColor?: string;
  showColorScale?: boolean;
  graphID?: string;
  maxRadiusValue?: number;
  maxXValue?: number;
  minXValue?: number;
  maxYValue?: number;
  minYValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  showNAColor?: boolean;
  minHeight?: number;
  annotations?: AnnotationSettingsDataType[];
  mode?: 'light' | 'dark';
  regressionLine?: boolean | string;
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  backgroundStyle?: BackgroundStyleDataType;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
  noOfXTicks?: number;
  noOfYTicks?: number;
  labelColor?: string;
  xSuffix?: string;
  ySuffix?: string;
  xPrefix?: string;
  yPrefix?: string;
}

export function ScatterPlot(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    showLabels = false,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    radius = 5,
    xAxisTitle = 'X Axis',
    yAxisTitle = 'Y Axis',
    padding,
    backgroundColor = false,
    leftMargin = 50,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 50,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    refXValues = [],
    refYValues = [],
    highlightAreaSettings = [null, null, null, null],
    showColorScale = true,
    highlightedDataPoints = [],
    graphID,
    maxRadiusValue,
    maxXValue,
    minXValue,
    maxYValue,
    minYValue,
    xSuffix = '',
    ySuffix = '',
    xPrefix = '',
    yPrefix = '',
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    highlightAreaColor = UNDPColorModule.light.grays['gray-300'],
    rtl = false,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    annotations = [],
    customHighlightAreaSettings = [],
    mode = 'light',
    regressionLine = false,
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
    noOfXTicks = 5,
    noOfYTicks = 5,
    labelColor,
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
      className={`ml-auto mr-auto flex flex-col ${
        width ? 'w-fit grow-0' : 'w-full grow'
      } h-inherit ${mode || 'light'}`}
      style={{
        ...backgroundStyle,
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
        }This is a scatter plot that shows correlation between two variables.${
          graphDescription ? ` ${graphDescription}` : ''
        }`
      }
    >
      <div
        className='flex grow'
        style={{
          padding: backgroundColor ? padding || '1rem' : padding || 0,
        }}
      >
        <div className='flex flex-col w-full gap-4 grow justify-between'>
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
            />
          ) : null}
          <div className='grow flex flex-col justify-center gap-3 w-full'>
            {showColorScale && data.filter(el => el.color).length !== 0 ? (
              <ColorLegendWithMouseOver
                rtl={rtl}
                language={language}
                width={width}
                colorLegendTitle={colorLegendTitle}
                colors={
                  (colors as string[] | undefined) ||
                  UNDPColorModule[mode].categoricalColors.colors
                }
                colorDomain={
                  colorDomain ||
                  (uniqBy(
                    data.filter(el => el.color),
                    'color',
                  ).map(d => d.color) as string[])
                }
                setSelectedColor={setSelectedColor}
                showNAColor={showNAColor}
                mode={mode}
              />
            ) : null}
            <div
              className='flex flex-col grow justify-center w-full leading-0'
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
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
                        : [UNDPColorModule[mode].primaryColors['blue-600']]
                      : (colors as string[] | undefined) ||
                        UNDPColorModule[mode].categoricalColors.colors
                  }
                  xAxisTitle={xAxisTitle}
                  yAxisTitle={yAxisTitle}
                  refXValues={refXValues}
                  refYValues={refYValues}
                  showLabels={showLabels}
                  radius={radius}
                  leftMargin={leftMargin}
                  rightMargin={rightMargin}
                  topMargin={topMargin}
                  bottomMargin={bottomMargin}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  highlightAreaSettings={highlightAreaSettings}
                  highlightedDataPoints={
                    data.filter(el => el.label).length === 0
                      ? []
                      : highlightedDataPoints
                  }
                  highlightAreaColor={highlightAreaColor}
                  selectedColor={selectedColor}
                  maxRadiusValue={maxRadiusValue}
                  maxXValue={maxXValue}
                  minXValue={minXValue}
                  maxYValue={maxYValue}
                  minYValue={minYValue}
                  onSeriesMouseClick={onSeriesMouseClick}
                  rtl={rtl}
                  language={language}
                  annotations={annotations}
                  customHighlightAreaSettings={customHighlightAreaSettings}
                  mode={mode}
                  regressionLine={regressionLine}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  tooltipBackgroundStyle={tooltipBackgroundStyle}
                  detailsOnClick={detailsOnClick}
                  noOfXTicks={noOfXTicks}
                  noOfYTicks={noOfYTicks}
                  labelColor={labelColor}
                  xSuffix={xSuffix}
                  ySuffix={ySuffix}
                  xPrefix={xPrefix}
                  yPrefix={yPrefix}
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
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
