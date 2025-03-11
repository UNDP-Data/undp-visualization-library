import uniqBy from 'lodash.uniqby';
import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';
import { Graph } from './Graph';
import {
  BackgroundStyleDataType,
  BarGraphDataType,
  CSSObject,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../../Types';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '../../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: BarGraphDataType[];
  colors?: string | string[];
  labelOrder?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  minHeight?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  barPadding?: number;
  showValues?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  showLabels?: boolean;
  showColorScale?: boolean;
  maxValue?: number;
  minValue?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  highlightedDataPoints?: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  sortData?: 'asc' | 'desc';
  language?: 'ar' | 'he' | 'en';
  showNAColor?: boolean;
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

export function HorizontalBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    barPadding = 0.25,
    showValues = true,
    showTicks = true,
    leftMargin = 100,
    rightMargin = 40,
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    highlightedDataPoints = [],
    padding,
    backgroundColor = false,
    topMargin = 25,
    bottomMargin = 10,
    showLabels = true,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale = true,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    sortData,
    labelOrder,
    language = 'en',
    showNAColor = true,
    minHeight = 0,
    mode = 'light',
    maxBarThickness,
    maxNumberOfBars,
    minBarThickness,
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    tooltipBackgroundStyle = {},
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
      className={mode || 'light'}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col ${
          width ? 'w-fit grow-0' : 'w-full grow'
        } h-inherit ${language || 'en'}`}
        style={{
          ...backgroundStyle,
          ...(backgroundColor && backgroundColor !== true
            ? { backgroundColor }
            : {}),
        }}
        id={graphID}
        ref={graphParentDiv}
        aria-label={
          ariaLabel ||
          `${
            graphTitle ? `The graph shows ${graphTitle}. ` : ''
          }This is a bar chart. ${
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
                graphTitle={graphTitle}
                graphDescription={graphDescription}
                width={width}
                graphDownload={
                  graphDownload ? graphParentDiv.current : undefined
                }
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
                />
              ) : null}
              <div
                className='flex grow flex-col justify-center w-full leading-0'
                ref={graphDiv}
                aria-label='Graph area'
              >
                {(width || svgWidth) && (height || svgHeight) ? (
                  <Graph
                    data={
                      sortData === 'asc'
                        ? sortBy(data, d => d.size).filter((_d, i) =>
                            maxNumberOfBars ? i < maxNumberOfBars : true,
                          )
                        : sortData === 'desc'
                        ? sortBy(data, d => d.size)
                            .reverse()
                            .filter((_d, i) =>
                              maxNumberOfBars ? i < maxNumberOfBars : true,
                            )
                        : data.filter((_d, i) =>
                            maxNumberOfBars ? i < maxNumberOfBars : true,
                          )
                    }
                    barColor={
                      data.filter(el => el.color).length === 0
                        ? colors
                          ? [colors as string]
                          : [UNDPColorModule[mode].primaryColors['blue-600']]
                        : (colors as string[] | undefined) ||
                          UNDPColorModule[mode].categoricalColors.colors
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
                    barPadding={barPadding}
                    showValues={showValues}
                    showTicks={showTicks}
                    leftMargin={leftMargin}
                    rightMargin={rightMargin}
                    topMargin={topMargin}
                    bottomMargin={bottomMargin}
                    truncateBy={truncateBy}
                    showLabels={showLabels}
                    tooltip={tooltip}
                    onSeriesMouseOver={onSeriesMouseOver}
                    refValues={refValues}
                    maxValue={maxValue}
                    minValue={minValue}
                    highlightedDataPoints={highlightedDataPoints}
                    onSeriesMouseClick={onSeriesMouseClick}
                    labelOrder={labelOrder}
                    rtl={language === 'he' || language === 'ar'}
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
                sources={sources}
                footNote={footNote}
                width={width}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
