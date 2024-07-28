import { useState, useRef, useEffect } from 'react';

import { Graph } from './Graph';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { ColorLegend } from '../../Elements/ColorLegend';
import { ButterflyChartDataType, ReferenceDataType } from '../../../Types';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: ButterflyChartDataType[];
  graphTitle?: string;
  graphDescription?: string;
  leftBarTitle?: string;
  rightBarTitle?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  barColors?: [string, string];
  relativeHeight?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  barPadding?: number;
  truncateBy?: number;
  suffix?: string;
  prefix?: string;
  showTicks?: boolean;
  showBarValue?: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  centerGap?: number;
  maxValue?: number;
  minValue?: number;
  showColorScale?: boolean;
  refValues?: ReferenceDataType[];
}

export function ButterflyChart(props: Props) {
  const {
    data,
    graphTitle,
    source,
    graphDescription,
    sourceLink,
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
    showBarValue,
    maxValue,
    minValue,
    refValues,
    suffix,
    prefix,
    showTicks,
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
            {showColorScale ? (
              <ColorLegend
                colorDomain={[
                  leftBarTitle || 'Left bar graph',
                  rightBarTitle || 'Right bar graph',
                ]}
                colors={
                  barColors || [
                    UNDPColorModule.categoricalColors.colors[0],
                    UNDPColorModule.categoricalColors.colors[1],
                  ]
                }
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
                  barColors={
                    barColors || [
                      UNDPColorModule.categoricalColors.colors[0],
                      UNDPColorModule.categoricalColors.colors[1],
                    ]
                  }
                  width={width || svgWidth}
                  centerGap={
                    checkIfNullOrUndefined(centerGap)
                      ? 100
                      : (centerGap as number)
                  }
                  height={
                    height ||
                    (relativeHeight
                      ? (width || svgWidth) * relativeHeight
                      : svgHeight)
                  }
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
                  showBarValue={
                    checkIfNullOrUndefined(showBarValue)
                      ? true
                      : (showBarValue as boolean)
                  }
                  onSeriesMouseClick={onSeriesMouseClick}
                  showTicks={showTicks !== false}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                />
              ) : null}
            </div>
          </div>
          {source || footNote ? (
            <GraphFooter
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
