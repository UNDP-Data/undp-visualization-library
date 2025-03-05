import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegend } from '../../../Elements/ColorLegend';
import {
  BackgroundStyleDataType,
  ButterflyChartDataType,
  CSSObject,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../Types';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: ButterflyChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  leftBarTitle?: string;
  rightBarTitle?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  barColors?: [string, string];
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  barPadding?: number;
  truncateBy?: number;
  suffix?: string;
  prefix?: string;
  showTicks?: boolean;
  showValues?: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  centerGap?: number;
  maxValue?: number;
  minValue?: number;
  showColorScale?: boolean;
  refValues?: ReferenceDataType[];
  language?: 'ar' | 'he' | 'en';
  colorLegendTitle?: string;
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function ButterflyChart(props: Props) {
  const {
    data,
    graphTitle,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    padding,
    barColors = [
      UNDPColorModule.light.categoricalColors.colors[0],
      UNDPColorModule.light.categoricalColors.colors[1],
    ],
    backgroundColor = false,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 25,
    bottomMargin = 30,
    rightBarTitle = 'Right bar graph',
    leftBarTitle = 'Left bar graph',
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    barPadding = 0.25,
    truncateBy = 999,
    onSeriesMouseClick,
    centerGap = 100,
    showValues = true,
    maxValue,
    minValue,
    refValues = [],
    suffix = '',
    prefix = '',
    showTicks = true,
    showColorScale = false,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    colorLegendTitle,
    minHeight = 0,
    mode = 'light',
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
  } = props;
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

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
        width ? 'grow-0 w-fit' : 'grow w-full'
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
        }This is a diverging bar chart. ${
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
            {showColorScale ? (
              <ColorLegend
                colorLegendTitle={colorLegendTitle}
                colorDomain={[leftBarTitle, rightBarTitle]}
                colors={barColors}
                showNAColor={false}
                mode={mode}
              />
            ) : null}
            <div
              className='flex flex-col grow justify-center leading-0'
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  barColors={barColors}
                  width={width || svgWidth}
                  centerGap={centerGap}
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
                  truncateBy={truncateBy}
                  leftMargin={leftMargin}
                  rightMargin={rightMargin}
                  topMargin={topMargin}
                  bottomMargin={bottomMargin}
                  axisTitles={[leftBarTitle, rightBarTitle]}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  barPadding={barPadding}
                  refValues={refValues}
                  maxValue={maxValue}
                  minValue={minValue}
                  showValues={showValues}
                  onSeriesMouseClick={onSeriesMouseClick}
                  showTicks={showTicks}
                  suffix={suffix}
                  prefix={prefix}
                  mode={mode}
                  resetSelectionOnDoubleClick={resetSelectionOnDoubleClick}
                  tooltipBackgroundStyle={tooltipBackgroundStyle}
                  detailsOnClick={detailsOnClick}
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
