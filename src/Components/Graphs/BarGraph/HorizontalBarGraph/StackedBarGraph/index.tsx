import { useState, useRef, useEffect } from 'react';
import sortBy from 'lodash.sortby';
import sum from 'lodash.sum';
import { Graph } from './Graph';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import {
  BackgroundStyleDataType,
  CSSObject,
  GroupedBarGraphDataType,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../../Types';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '../../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: GroupedBarGraphDataType[];
  colors?: string[];
  labelOrder?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  barPadding?: number;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  showLabels?: boolean;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
  sortParameter?: number | 'total';
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

export function HorizontalStackedBarGraph(props: Props) {
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
    truncateBy = 999,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    topMargin = 25,
    bottomMargin = 10,
    tooltip,
    onSeriesMouseOver,
    suffix = '',
    prefix = '',
    showLabels = true,
    relativeHeight,
    showValues,
    refValues,
    graphID,
    maxValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    labelOrder,
    minHeight = 0,
    mode = 'light',
    maxBarThickness,
    sortParameter,
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
      className={`ml-auto mr-auto flex flex-col ${
        width ? 'w-fit grow-0' : 'w-full grow'
      } h-inherit ${mode || 'light'} ${language || 'en'}`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
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
        }This is a stacked bar chart. ${
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
        <div className='flex flex-col gap-4 w-full grow justify-between'>
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
          <div className='grow flex flex-col justify-center gap-3 w-full'>
            <ColorLegendWithMouseOver
              width={width}
              colorDomain={colorDomain}
              colors={colors}
              colorLegendTitle={colorLegendTitle}
              setSelectedColor={setSelectedColor}
              showNAColor={false}
              mode={mode}
            />
            <div
              className='w-full grow leading-0'
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={
                    sortParameter !== undefined
                      ? sortParameter === 'total'
                        ? sortBy(data, d =>
                            sum(
                              d.size.filter(el => !checkIfNullOrUndefined(el)),
                            ),
                          )
                            .reverse()
                            .filter((_d, i) =>
                              maxNumberOfBars ? i < maxNumberOfBars : true,
                            )
                        : sortBy(data, d =>
                            checkIfNullOrUndefined(d.size[sortParameter])
                              ? -Infinity
                              : d.size[sortParameter],
                          )
                            .reverse()
                            .filter((_d, i) =>
                              maxNumberOfBars ? i < maxNumberOfBars : true,
                            )
                      : data.filter((_d, i) =>
                          maxNumberOfBars ? i < maxNumberOfBars : true,
                        )
                  }
                  barColors={colors}
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
                  barPadding={barPadding}
                  showTicks={showTicks}
                  leftMargin={leftMargin}
                  rightMargin={rightMargin}
                  topMargin={topMargin}
                  bottomMargin={bottomMargin}
                  truncateBy={truncateBy}
                  showLabels={showLabels}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showValues={showValues}
                  suffix={suffix}
                  prefix={prefix}
                  refValues={refValues}
                  maxValue={maxValue}
                  onSeriesMouseClick={onSeriesMouseClick}
                  selectedColor={selectedColor}
                  rtl={language === 'he' || language === 'ar'}
                  labelOrder={labelOrder}
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
            <GraphFooter sources={sources} footNote={footNote} width={width} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
