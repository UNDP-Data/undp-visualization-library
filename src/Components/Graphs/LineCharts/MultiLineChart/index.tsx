/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { MultiLineChartDataType, ReferenceDataType } from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { ColorLegend } from '../../../Elements/ColorLegend';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: MultiLineChartDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  noOfXTicks?: number;
  dateFormat?: string;
  suffix?: string;
  prefix?: string;
  labels: string[];
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  showValues?: boolean;
  relativeHeight?: number;
  showColorLegendAtTop?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings?: [number | null, number | null];
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  highlightedLines?: string[];
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  animateLine?: boolean | number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  colorLegendTitle?: string;
  minHeight?: number;
}

export function MultiLineChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix,
    source,
    prefix,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    noOfXTicks,
    dateFormat,
    labels,
    padding,
    showValues,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    showColorLegendAtTop,
    refValues,
    highlightAreaSettings,
    graphID,
    minValue,
    maxValue,
    highlightedLines,
    graphDownload,
    dataDownload,
    highlightAreaColor,
    animateLine,
    rtl,
    language,
    colorLegendTitle,
    minHeight,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

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
          ? UNDPColorModule.grays['gray-200']
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
            {showColorLegendAtTop ? (
              <ColorLegend
                rtl={rtl}
                language={language}
                colorDomain={labels}
                colorLegendTitle={colorLegendTitle}
                colors={colors || UNDPColorModule.categoricalColors.colors}
                showNAColor={false}
              />
            ) : null}
            <div
              style={{ flexGrow: 1, width: '100%', lineHeight: 0 }}
              ref={graphDiv}
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  colors={colors || UNDPColorModule.categoricalColors.colors}
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
                  dateFormat={dateFormat || 'yyyy'}
                  noOfXTicks={
                    checkIfNullOrUndefined(noOfXTicks)
                      ? 10
                      : (noOfXTicks as number)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 50
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? showColorLegendAtTop
                        ? 30
                        : 50
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
                  labels={labels}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showColorLegendAtTop={showColorLegendAtTop}
                  showValues={showValues}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                  highlightAreaSettings={highlightAreaSettings || [null, null]}
                  refValues={refValues}
                  minValue={minValue}
                  maxValue={maxValue}
                  highlightedLines={highlightedLines || []}
                  highlightAreaColor={
                    highlightAreaColor || UNDPColorModule.grays['gray-300']
                  }
                  animateLine={animateLine}
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
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
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
