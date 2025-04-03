import { useEffect, useRef, useState } from 'react';
import min from 'lodash.min';
import sortBy from 'lodash.sortby';
import { P } from '@undp-data/undp-design-system-react';
import { Graph } from './Graph';
import {
  DonutChartDataType,
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import { numberFormattingFunction } from '@/Utils/numberFormattingFunction';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { UNDPColorModule } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  mainText?: string | { label: string; suffix?: string; prefix?: string };
  data: DonutChartDataType[];
  colors?: string[];
  graphTitle?: string;
  suffix?: string;
  prefix?: string;
  topMargin?: number;
  bottomMargin?: number;
  sources?: SourcesDataType[];
  graphDescription?: string;
  subNote?: string;
  footNote?: string;
  radius?: number;
  strokeWidth?: number;
  graphLegend?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  colorDomain?: string[];
  sortData?: 'asc' | 'desc';
  language?: Languages;
  mode?: 'light' | 'dark';
  width?: number;
  height?: number;
  minHeight?: number;
  relativeHeight?: number;
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  legendMaxWidth?: string;
  detailsOnClick?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function DonutChart(props: Props) {
  const {
    mainText,
    graphTitle,
    colors = UNDPColorModule.light.categoricalColors.colors,
    suffix = '',
    sources,
    prefix = '',
    strokeWidth = 50,
    graphDescription,
    subNote,
    footNote,
    radius,
    data,
    graphLegend = true,
    padding,
    backgroundColor = false,
    tooltip,
    onSeriesMouseOver,
    graphID,
    onSeriesMouseClick,
    topMargin = 0,
    bottomMargin = 0,
    graphDownload = false,
    dataDownload = false,
    colorDomain,
    sortData,
    language = 'en',
    mode = 'light',
    width,
    height,
    minHeight = 0,
    relativeHeight,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    legendMaxWidth,
    detailsOnClick,
    styles,
    classNames,
  } = props;

  const [donutRadius, setDonutRadius] = useState(0);
  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(width || entries[0].target.clientWidth || 420);
      setSvgHeight(height || entries[0].target.clientHeight || 420);
      setDonutRadius(
        (min([
          width || entries[0].target.clientWidth || 620,
          height || entries[0].target.clientHeight || 480,
        ]) || 420) / 2,
      );
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 420);
      setSvgWidth(graphDiv.current.clientWidth || 420);
      setDonutRadius(
        (min([graphDiv.current.clientWidth, graphDiv.current.clientHeight]) ||
          420) / 2,
      );
      if (!width || !radius) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [width, height]);

  const sortedData =
    sortData === 'asc'
      ? sortBy(data, d => d.size)
      : sortData === 'desc'
      ? sortBy(data, d => d.size).reverse()
      : data;

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
          ...(styles?.graphBackground || {}),
          minHeight: 'inherit',
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
          }This is a donut or pie chart chart. ${
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
          <div className='flex flex-col gap-2 w-full grow justify-between'>
            {graphTitle || graphDescription || graphDownload || dataDownload ? (
              <GraphHeader
                styles={{
                  title: styles?.title,
                  description: styles?.description,
                }}
                classNames={{
                  title: classNames?.title,
                  description: classNames?.description,
                }}
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
            <div
              className='flex grow flex-col justify-center items-stretch gap-8 flex-wrap'
              style={{
                width: width ? `${width}px` : '100%',
                padding: `${topMargin}px 0 ${bottomMargin}px 0`,
              }}
            >
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {graphLegend ? (
                    <div className='leading-0' aria-label='Color legend'>
                      <div
                        className='flex mb-0 ml-auto mr-auto justify-center gap-3.5 flex-wrap'
                        style={{
                          maxWidth: legendMaxWidth,
                        }}
                      >
                        {sortedData.map((d, i) => (
                          <div className='flex gap-2 items-center' key={i}>
                            <div
                              className='w-3 h-3 rounded-full'
                              style={{
                                backgroundColor:
                                  (
                                    colorDomain ||
                                    sortedData.map(el => el.label)
                                  ).indexOf(d.label) !== -1
                                    ? (colors ||
                                        UNDPColorModule[mode].categoricalColors
                                          .colors)[
                                        (
                                          colorDomain ||
                                          sortedData.map(el => el.label)
                                        ).indexOf(d.label) %
                                          (
                                            colors ||
                                            UNDPColorModule[mode]
                                              .categoricalColors.colors
                                          ).length
                                      ]
                                    : UNDPColorModule.gray,
                              }}
                            />
                            <P
                              marginBottom='none'
                              size='sm'
                              className='text-primary-gray-700 dark:text-primary-gray-100'
                            >
                              {d.label}:{' '}
                              <span
                                className='font-bold'
                                style={{ fontSize: 'inherit' }}
                              >
                                {numberFormattingFunction(
                                  d.size,
                                  prefix,
                                  suffix,
                                )}
                              </span>
                            </P>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <div
                    className={`flex ${
                      width ? 'grow-0' : 'grow'
                    } items-center justify-center leading-0`}
                    style={{
                      width: width ? `${width}px` : '100%',
                      height: height
                        ? `${Math.max(
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
                          )}px`
                        : 'auto',
                    }}
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    <div className='w-full flex justify-center leading-0'>
                      {radius || donutRadius ? (
                        <Graph
                          mainText={mainText}
                          data={
                            sortData === 'asc'
                              ? sortBy(data, d => d.size)
                              : sortData === 'desc'
                              ? sortBy(data, d => d.size).reverse()
                              : data
                          }
                          colors={colors}
                          radius={radius || donutRadius}
                          subNote={subNote}
                          strokeWidth={strokeWidth}
                          tooltip={tooltip}
                          colorDomain={
                            colorDomain || sortedData.map(d => d.label)
                          }
                          onSeriesMouseOver={onSeriesMouseOver}
                          onSeriesMouseClick={onSeriesMouseClick}
                          resetSelectionOnDoubleClick={
                            resetSelectionOnDoubleClick
                          }
                          styles={styles}
                          detailsOnClick={detailsOnClick}
                        />
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </div>
            {sources || footNote ? (
              <GraphFooter
                styles={{ footnote: styles?.footnote, source: styles?.source }}
                classNames={{
                  footnote: classNames?.footnote,
                  source: classNames?.source,
                }}
                sources={sources}
                footNote={footNote}
                width={width}
              />
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
