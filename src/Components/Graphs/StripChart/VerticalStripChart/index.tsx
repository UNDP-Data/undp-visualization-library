import uniqBy from 'lodash.uniqby';
import { useState, useRef, useEffect } from 'react';
import {
  BackgroundStyleDataType,
  CSSObject,
  Languages,
  SourcesDataType,
  StripChartDataType,
} from '../../../../Types';
import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../ColorPalette';
import { EmptyState } from '../../../Elements/EmptyState';

interface Props {
  data: StripChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  radius?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightedDataPoints?: (string | number)[];
  showColorScale?: boolean;
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  showAxis?: boolean;
  graphDownload?: boolean;
  dataDownload?: boolean;
  prefix?: string;
  suffix?: string;
  stripType?: 'strip' | 'dot';
  language?: Languages;
  highlightColor?: string;
  dotOpacity?: number;
  showNAColor?: boolean;
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  resetSelectionOnDoubleClick?: boolean;
  tooltipBackgroundStyle?: CSSObject;
  detailsOnClick?: string;
}

export function VerticalStripChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    radius = 5,
    padding,
    backgroundColor = false,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 10,
    bottomMargin = 10,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    showColorScale = true,
    highlightedDataPoints = [],
    graphID,
    minValue,
    maxValue,
    onSeriesMouseClick,
    showAxis = true,
    graphDownload = false,
    dataDownload = false,
    prefix = '',
    suffix = '',
    stripType = 'dot',
    language = 'en',
    highlightColor,
    dotOpacity = 0.3,
    showNAColor = true,
    minHeight = 0,
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    resetSelectionOnDoubleClick = true,
    tooltipBackgroundStyle,
    detailsOnClick,
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
      className={`${mode || 'light'} flex  ${
        width ? 'w-fit grow-0' : 'w-full grow'
      }`}
      dir={language === 'he' || language === 'ar' ? 'rtl' : undefined}
    >
      <div
        className={`${
          !backgroundColor
            ? 'bg-transparent '
            : backgroundColor === true
            ? 'bg-primary-gray-200 dark:bg-primary-gray-650 '
            : ''
        }ml-auto mr-auto flex flex-col grow h-inherit ${language || 'en'}`}
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
          }This is a strip chart showing distribution of data along the vertical axis. Each dot represents an individual data point, helping to visualize the spread and clustering of values.${
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
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {showColorScale !== false &&
                  data.filter(el => el.color).length !== 0 ? (
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
                    className='flex flex-col grow justify-center w-full leading-0'
                    ref={graphDiv}
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
                                ? (width || svgWidth) * relativeHeight >
                                  minHeight
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
                              : [
                                  UNDPColorModule[mode].primaryColors[
                                    'blue-600'
                                  ],
                                ]
                            : (colors as string[] | undefined) ||
                              UNDPColorModule[mode].categoricalColors.colors
                        }
                        selectedColor={selectedColor}
                        radius={radius}
                        leftMargin={leftMargin}
                        rightMargin={rightMargin}
                        topMargin={topMargin}
                        bottomMargin={bottomMargin}
                        tooltip={tooltip}
                        onSeriesMouseOver={onSeriesMouseOver}
                        highlightedDataPoints={highlightedDataPoints}
                        minValue={minValue}
                        maxValue={maxValue}
                        onSeriesMouseClick={onSeriesMouseClick}
                        showAxis={showAxis}
                        prefix={prefix}
                        suffix={suffix}
                        stripType={stripType}
                        highlightColor={highlightColor}
                        dotOpacity={dotOpacity}
                        resetSelectionOnDoubleClick={
                          resetSelectionOnDoubleClick
                        }
                        tooltipBackgroundStyle={tooltipBackgroundStyle}
                        detailsOnClick={detailsOnClick}
                      />
                    ) : null}
                  </div>
                </>
              )}
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
