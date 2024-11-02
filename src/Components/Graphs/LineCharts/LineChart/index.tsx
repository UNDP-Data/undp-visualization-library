import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import {
  AnnotationSettingsDataType,
  CustomHighlightAreaSettingsDataType,
  LineChartDataType,
  ReferenceDataType,
  SourcesDataType,
} from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: LineChartDataType[];
  graphID?: string;
  color?: string;
  graphTitle?: string;
  graphDescription?: string;
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
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  highlightAreaSettings?: [number | string | null, number | string | null];
  maxValue?: number;
  minValue?: number;
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  animateLine?: boolean | number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  strokeWidth?: number;
  showDots?: boolean;
  annotations?: AnnotationSettingsDataType[];
  customHighlightAreaSettings?: CustomHighlightAreaSettingsDataType[];
  mode?: 'light' | 'dark';
  regressionLine?: boolean | string;
}

export function SimpleLineChart(props: Props) {
  const {
    data,
    graphTitle,
    color,
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
    backgroundColor,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    highlightAreaSettings,
    graphID,
    minValue,
    maxValue,
    graphDownload,
    dataDownload,
    highlightAreaColor,
    animateLine,
    rtl,
    language,
    minHeight,
    strokeWidth,
    showDots,
    annotations,
    customHighlightAreaSettings,
    mode,
    regressionLine,
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
        marginLeft: 'auto',
        height: 'inherit',
        marginRight: 'auto',
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
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
          >
            {(width || svgWidth) && (height || svgHeight) ? (
              <Graph
                data={data}
                color={
                  color ||
                  UNDPColorModule[mode || 'light'].primaryColors['blue-600']
                }
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
                    ? 50
                    : (leftMargin as number)
                }
                rightMargin={
                  checkIfNullOrUndefined(rightMargin)
                    ? 30
                    : (rightMargin as number)
                }
                topMargin={
                  checkIfNullOrUndefined(topMargin) ? 20 : (topMargin as number)
                }
                bottomMargin={
                  checkIfNullOrUndefined(bottomMargin)
                    ? 25
                    : (bottomMargin as number)
                }
                tooltip={tooltip}
                highlightAreaSettings={highlightAreaSettings || [null, null]}
                onSeriesMouseOver={onSeriesMouseOver}
                refValues={refValues}
                minValue={minValue}
                maxValue={maxValue}
                highlightAreaColor={
                  highlightAreaColor ||
                  UNDPColorModule[mode || 'light'].grays['gray-300']
                }
                animateLine={animateLine}
                rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                language={language || (rtl ? 'ar' : 'en')}
                strokeWidth={strokeWidth || 2}
                showDots={showDots !== false}
                annotations={annotations || []}
                customHighlightAreaSettings={customHighlightAreaSettings || []}
                mode={mode || 'light'}
                regressionLine={regressionLine || false}
              />
            ) : null}
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
