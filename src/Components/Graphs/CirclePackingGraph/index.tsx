import uniqBy from 'lodash.uniqby';

import { useState, useRef, useEffect } from 'react';
import sum from 'lodash.sum';
import maxBy from 'lodash.maxby';
import { Graph } from './Graph';
import {
  Languages,
  SourcesDataType,
  StyleObject,
  ClassNameObject,
  TreeMapDataType,
} from '@/Types';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '@/Components/ColorPalette';
import { checkIfNullOrUndefined } from '@/Utils/checkIfNullOrUndefined';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  // Data
  data: TreeMapDataType[];

  // Titles, Labels, and Sources
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sources?: SourcesDataType[];
  ariaLabel?: string;

  // Colors and Styling
  colors?: string | string[];
  colorDomain?: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  styles?: StyleObject;
  classNames?: ClassNameObject;

  // Size and Spacing
  width?: number;
  height?: number;
  minHeight?: number;
  relativeHeight?: number;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  radius?: number;

  // Values and Ticks
  prefix?: string;
  suffix?: string;
  maxRadiusValue?: number;

  // Graph Parameters
  showLabels?: boolean;
  showValues?: boolean;
  showColorScale?: boolean;
  showNAColor?: boolean;
  highlightedDataPoints?: (string | number)[];
  graphDownload?: boolean;
  dataDownload?: boolean;
  resetSelectionOnDoubleClick?: boolean;

  // Interactions and Callbacks
  tooltip?: string;
  detailsOnClick?: string;
  onSeriesMouseOver?: (_d: any) => void;
  onSeriesMouseClick?: (_d: any) => void;

  // Configuration and Options
  language?: Languages;
  mode?: 'light' | 'dark';
  graphID?: string;
}

export function CirclePackingGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix = '',
    sources,
    prefix = '',
    graphDescription,
    leftMargin = 0,
    rightMargin = 0,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor = false,
    topMargin = 0,
    bottomMargin = 0,
    showLabels = true,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    showColorScale = true,
    showValues,
    graphID,
    highlightedDataPoints = [],
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    showNAColor,
    minHeight = 0,
    mode = 'light',
    ariaLabel,
    radius,
    maxRadiusValue,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    styles,
    classNames,
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
          ...(styles?.graphBackground || {}),
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
          }This is a chart where data points are represented by circles, and their sizes reflect their values.${
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
            <div className='grow flex flex-col justify-center gap-3 w-full'>
              {data.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  {showColorScale &&
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
                      showNAColor={
                        showNAColor === undefined || showNAColor === null
                          ? true
                          : showNAColor
                      }
                      isCenter
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
                        leftMargin={leftMargin}
                        rightMargin={rightMargin}
                        topMargin={topMargin}
                        bottomMargin={bottomMargin}
                        showLabels={showLabels}
                        showValues={
                          showValues !== false
                            ? data.filter(el => el.size).length !== 0
                            : (showValues as boolean)
                        }
                        selectedColor={selectedColor}
                        suffix={suffix}
                        prefix={prefix}
                        tooltip={tooltip}
                        onSeriesMouseOver={onSeriesMouseOver}
                        highlightedDataPoints={highlightedDataPoints}
                        onSeriesMouseClick={onSeriesMouseClick}
                        mode={mode}
                        radius={
                          !radius
                            ? (Math.min(
                                width || svgWidth,
                                height ||
                                  (relativeHeight
                                    ? minHeight
                                      ? (width || svgWidth) * relativeHeight >
                                        minHeight
                                        ? (width || svgWidth) * relativeHeight
                                        : minHeight
                                      : (width || svgWidth) * relativeHeight
                                    : svgHeight),
                              ) *
                                (data.filter(
                                  d => !checkIfNullOrUndefined(d.size),
                                ).length === 0
                                  ? 1
                                  : (maxBy(data, 'size') as any).size)) /
                              (data.filter(d => !checkIfNullOrUndefined(d.size))
                                .length === 0
                                ? data.length
                                : sum(
                                    data.filter(d => d.size).map(d => d.size),
                                  ) * 1.25)
                            : radius
                        }
                        maxRadiusValue={maxRadiusValue}
                        resetSelectionOnDoubleClick={
                          resetSelectionOnDoubleClick
                        }
                        detailsOnClick={detailsOnClick}
                        styles={styles}
                        classNames={classNames}
                      />
                    ) : null}
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
