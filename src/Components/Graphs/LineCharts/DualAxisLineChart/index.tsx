import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { ColorLegend } from '../../../Elements/ColorLegend';
import { DualAxisLineChartDataType } from '../../../../Types';
import { UNDPColorModule } from '../../../ColorPalette';

interface Props {
  data: DualAxisLineChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  lineTitles?: [string, string];
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
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
  sameAxes?: boolean;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  highlightAreaSettings?: [number | null, number | null];
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  highlightAreaColor?: string;
  animateLine?: boolean | number;
  rtl?: boolean;
  showColorScale?: boolean;
  language?: 'ar' | 'he' | 'en';
}

export function DualAxisLineChart(props: Props) {
  const {
    data,
    graphTitle,
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
    showValues,
    padding,
    lineColors,
    sameAxes,
    backgroundColor,
    leftMargin,
    rightMargin,
    lineTitles,
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
    showColorScale,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);

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
            {showColorScale === false ? null : (
              <ColorLegend
                rtl={rtl}
                language={language}
                colorDomain={lineTitles || ['Line 1', 'Line 2']}
                colors={
                  lineColors || [
                    UNDPColorModule.categoricalColors.colors[0],
                    UNDPColorModule.categoricalColors.colors[1],
                  ]
                }
                showNAColor={false}
              />
            )}
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
                  sameAxes={sameAxes}
                  lineColors={
                    lineColors || [
                      UNDPColorModule.categoricalColors.colors[0],
                      UNDPColorModule.categoricalColors.colors[1],
                    ]
                  }
                  width={width || svgWidth}
                  height={
                    height ||
                    (relativeHeight
                      ? (width || svgWidth) * relativeHeight
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
                      ? 80
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? 80
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
                  lineTitles={lineTitles || ['Line 1', 'Line 2']}
                  highlightAreaSettings={highlightAreaSettings || [null, null]}
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
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
