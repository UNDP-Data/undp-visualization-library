import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import {
  ReferenceDataType,
  GroupedBarGraphDataType,
  SourcesDataType,
  Languages,
  StyleObject,
  ClassNameObject,
} from '@/Types';
import { GraphHeader } from '@/Components/Elements/GraphHeader';
import { GraphFooter } from '@/Components/Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '@/Components/Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '@/Components/ColorPalette';
import { EmptyState } from '@/Components/Elements/EmptyState';

interface Props {
  data: GroupedBarGraphDataType[];
  colors?: string[];
  graphTitle?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  graphDescription?: string;
  footNote?: string;
  barPadding?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showTicks?: boolean;
  colorDomain: string[];
  colorLegendTitle?: string;
  labelOrder?: string[];
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  language?: Languages;
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
  ariaLabel?: string;
  resetSelectionOnDoubleClick?: boolean;
  detailsOnClick?: string;
  barAxisTitle?: string;
  noOfTicks?: number;
  valueColor?: string;
  styles?: StyleObject;
  classNames?: ClassNameObject;
}

export function VerticalGroupedBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    colors = UNDPColorModule.light.categoricalColors.colors,
    sources,
    graphDescription,
    barPadding = 0.25,
    showTicks = true,
    leftMargin = 20,
    rightMargin = 20,
    topMargin = 20,
    bottomMargin = 25,
    truncateBy = 999,
    showLabels = true,
    showValues = true,
    backgroundColor = false,
    suffix = '',
    prefix = '',
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    graphID,
    maxValue,
    minValue,
    onSeriesMouseClick,
    graphDownload = false,
    dataDownload = false,
    language = 'en',
    mode = 'light',
    labelOrder,
    minHeight = 0,
    maxBarThickness,
    ariaLabel,
    resetSelectionOnDoubleClick = true,
    detailsOnClick,
    barAxisTitle,
    noOfTicks = 5,
    valueColor,
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
          }This is a grouped bar chart. ${
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
                  <ColorLegendWithMouseOver
                    width={width}
                    colorDomain={colorDomain}
                    colors={colors}
                    colorLegendTitle={colorLegendTitle}
                    setSelectedColor={setSelectedColor}
                    showNAColor={false}
                  />
                  <div
                    className='w-full grow leading-0'
                    ref={graphDiv}
                    aria-label='Graph area'
                  >
                    {(width || svgWidth) && (height || svgHeight) ? (
                      <Graph
                        data={data}
                        barColors={colors}
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
                        suffix={suffix}
                        prefix={prefix}
                        barPadding={barPadding}
                        showLabels={showLabels}
                        showValues={showValues}
                        showTicks={showTicks}
                        truncateBy={truncateBy}
                        leftMargin={leftMargin}
                        rightMargin={rightMargin}
                        topMargin={topMargin}
                        bottomMargin={bottomMargin}
                        tooltip={tooltip}
                        onSeriesMouseOver={onSeriesMouseOver}
                        refValues={refValues}
                        maxValue={maxValue}
                        minValue={minValue}
                        onSeriesMouseClick={onSeriesMouseClick}
                        selectedColor={selectedColor}
                        labelOrder={labelOrder}
                        maxBarThickness={maxBarThickness}
                        resetSelectionOnDoubleClick={
                          resetSelectionOnDoubleClick
                        }
                        detailsOnClick={detailsOnClick}
                        barAxisTitle={barAxisTitle}
                        noOfTicks={noOfTicks}
                        valueColor={valueColor}
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
