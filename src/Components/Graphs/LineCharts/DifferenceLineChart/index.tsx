import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { ColorLegend } from '../../../Elements/ColorLegend';
import {
  AnnotationSettingsDataType,
  CustomHighlightAreaSettingsDataType,
  DifferenceLineChartDataType,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../Types';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: DifferenceLineChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  diffAreaColors?: [string, string];
  footNote?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  sources?: SourcesDataType[];
  noOfXTicks?: number;
  dateFormat?: string;
  showValues?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  lineColors?: [string, string];
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightAreaSettings?: [number | string | null, number | string | null];
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  animateLine?: boolean | number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  showColorLegendAtTop?: boolean;
  labels: [string, string];
  colorLegendTitle?: string;
  idSuffix: string;
  strokeWidth?: number;
  showDots?: boolean;
  refValues?: ReferenceDataType[];
  maxValue?: number;
  minValue?: number;
  annotations?: AnnotationSettingsDataType[];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  mode?: 'light' | 'dark';
  ariaLabel?: string;
}

export function DifferenceLineChart(props: Props) {
  const {
    data,
    graphTitle,
    suffix,
    sources,
    prefix,
    graphDescription,
    height,
    width,
    footNote,
    noOfXTicks,
    dateFormat,
    showValues,
    padding,
    lineColors,
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    tooltip,
    highlightAreaSettings,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    graphDownload,
    dataDownload,
    highlightAreaColor,
    animateLine,
    rtl,
    language,
    minHeight,
    labels,
    showColorLegendAtTop,
    colorLegendTitle,
    diffAreaColors,
    idSuffix,
    strokeWidth,
    showDots,
    refValues,
    minValue,
    maxValue,
    annotations,
    customHighlightAreaSettings,
    mode,
    ariaLabel,
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
  }, [graphDiv?.current, width, height]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: width ? 'fit-content' : '100%',
        flexGrow: width ? 0 : 1,
        height: 'inherit',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      ref={graphParentDiv}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is a line chart that highlights the difference between two datasets over time.${
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
              mode={mode || 'light'}
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
                colors={
                  lineColors || [
                    UNDPColorModule[mode || 'light'].categoricalColors
                      .colors[0],
                    UNDPColorModule[mode || 'light'].categoricalColors
                      .colors[1],
                  ]
                }
                showNAColor={false}
                mode={mode || 'light'}
              />
            ) : null}
            <div
              style={{
                flexGrow: 1,
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                lineHeight: 0,
              }}
              ref={graphDiv}
              aria-label='Graph area'
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  lineColors={
                    lineColors || [
                      UNDPColorModule[mode || 'light'].categoricalColors
                        .colors[0],
                      UNDPColorModule[mode || 'light'].categoricalColors
                        .colors[1],
                    ]
                  }
                  colorDomain={labels}
                  width={width || svgWidth}
                  height={Math.max(
                    minHeight || 0,
                    height ||
                      (relativeHeight
                        ? minHeight
                          ? (width || svgWidth) * relativeHeight > minHeight
                            ? (width || svgWidth) * relativeHeight
                            : minHeight
                          : (width || svgWidth) * relativeHeight
                        : svgHeight),
                  )}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                  dateFormat={dateFormat || 'yyyy'}
                  showValues={showValues}
                  noOfXTicks={
                    checkIfNullOrUndefined(noOfXTicks)
                      ? 10
                      : (noOfXTicks as number)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 60
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
                  highlightAreaSettings={highlightAreaSettings || [null, null]}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showColorLegendAtTop={showColorLegendAtTop}
                  highlightAreaColor={
                    highlightAreaColor ||
                    UNDPColorModule[mode || 'light'].grays['gray-300']
                  }
                  animateLine={animateLine}
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
                  diffAreaColors={
                    diffAreaColors || [
                      UNDPColorModule[mode || 'light'].alerts.red,
                      UNDPColorModule[mode || 'light'].alerts.darkGreen,
                    ]
                  }
                  idSuffix={idSuffix}
                  strokeWidth={strokeWidth || 2}
                  showDots={showDots !== false}
                  refValues={refValues}
                  minValue={minValue}
                  maxValue={maxValue}
                  annotations={annotations || []}
                  customHighlightAreaSettings={
                    customHighlightAreaSettings || []
                  }
                  mode={mode || 'light'}
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
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
