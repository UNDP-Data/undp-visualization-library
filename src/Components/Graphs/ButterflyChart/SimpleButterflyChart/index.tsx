import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { ColorLegend } from '../../../Elements/ColorLegend';
import {
  ButterflyChartDataType,
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
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  colorLegendTitle?: string;
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
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
    barColors,
    backgroundColor,
    leftMargin,
    rightMargin,
    rightBarTitle,
    leftBarTitle,
    topMargin,
    bottomMargin,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    graphDownload,
    dataDownload,
    barPadding,
    truncateBy,
    onSeriesMouseClick,
    centerGap,
    showValues,
    maxValue,
    minValue,
    refValues,
    suffix,
    prefix,
    showTicks,
    showColorScale,
    rtl,
    language,
    colorLegendTitle,
    minHeight,
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
        }This is a diverging bar chart. ${
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
            {showColorScale ? (
              <ColorLegend
                rtl={rtl}
                language={language}
                colorLegendTitle={colorLegendTitle}
                colorDomain={[
                  leftBarTitle || 'Left bar graph',
                  rightBarTitle || 'Right bar graph',
                ]}
                colors={
                  barColors || [
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
                  barColors={
                    barColors || [
                      UNDPColorModule[mode || 'light'].categoricalColors
                        .colors[0],
                      UNDPColorModule[mode || 'light'].categoricalColors
                        .colors[1],
                    ]
                  }
                  width={width || svgWidth}
                  centerGap={
                    checkIfNullOrUndefined(centerGap)
                      ? 100
                      : (centerGap as number)
                  }
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
                  truncateBy={
                    checkIfNullOrUndefined(truncateBy)
                      ? 999
                      : (bottomMargin as number)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 20
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? 20
                      : (rightMargin as number)
                  }
                  topMargin={
                    checkIfNullOrUndefined(topMargin)
                      ? 25
                      : (topMargin as number)
                  }
                  bottomMargin={
                    checkIfNullOrUndefined(bottomMargin)
                      ? 30
                      : (bottomMargin as number)
                  }
                  axisTitles={[
                    leftBarTitle || 'Left bar graph',
                    rightBarTitle || 'Right bar graph',
                  ]}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  barPadding={barPadding || 0.25}
                  refValues={refValues || []}
                  maxValue={maxValue}
                  minValue={minValue}
                  showValues={
                    checkIfNullOrUndefined(showValues)
                      ? true
                      : (showValues as boolean)
                  }
                  onSeriesMouseClick={onSeriesMouseClick}
                  showTicks={showTicks !== false}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
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
