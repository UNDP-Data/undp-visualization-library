import { useState, useRef, useEffect } from 'react';

import uniqBy from 'lodash.uniqby';
import { ascending, sort } from 'd3-array';
import { format, parse } from 'date-fns';
import Slider from 'rc-slider';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { checkIfNullOrUndefined } from '../../../../Utils/checkIfNullOrUndefined';
import { ColorLegend } from '../../../Elements/ColorLegend';
import {
  ButterflyChartWithDateDataType,
  ReferenceDataType,
} from '../../../../Types';
import { UNDPColorModule } from '../../../ColorPalette';
import { Pause, Play } from '../../../Icons/Icons';
import 'rc-slider/assets/index.css';
import { Graph } from './Graph';

interface Props {
  data: ButterflyChartWithDateDataType[];
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
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  colorLegendTitle?: string;
  minHeight?: number;
}

export function AnimatedButterflyChart(props: Props) {
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
    showValues,
    maxValue,
    minValue,
    refValues,
    suffix,
    prefix,
    showTicks,
    showColorScale,
    dateFormat,
    showOnlyActiveDate,
    autoPlay,
    rtl,
    colorLegendTitle,
    language,
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

  const [play, setPlay] = useState(autoPlay || false);
  const uniqDatesSorted = sort(
    uniqBy(data, d => d.date).map(d =>
      parse(`${d.date}`, dateFormat || 'yyyy', new Date()).getTime(),
    ),
    (a, b) => ascending(a, b),
  );
  const [index, setIndex] = useState(autoPlay ? 0 : uniqDatesSorted.length - 1);

  const markObj: any = {};

  uniqDatesSorted.forEach((d, i) => {
    markObj[`${d}`] = {
      style: {
        color: i === index ? '#232E3D' : '#A9B1B7', // Active text color vs. inactive
        fontWeight: i === index ? 'bold' : 'normal', // Active font weight vs. inactive
        display: i === index || !showOnlyActiveDate ? 'inline' : 'none', // Active font weight vs. inactive
      },
      label: format(new Date(d), dateFormat || 'yyyy'),
    };
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i < uniqDatesSorted.length - 1 ? i + 1 : 0));
    }, 2000);
    if (!play) clearInterval(interval);
    return () => clearInterval(interval);
  }, [uniqDatesSorted, play]);

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
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <button
              type='button'
              onClick={() => {
                setPlay(!play);
              }}
              style={{
                padding: 0,
                border: 0,
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              {play ? <Pause /> : <Play />}
            </button>
            <Slider
              min={uniqDatesSorted[0]}
              max={uniqDatesSorted[uniqDatesSorted.length - 1]}
              marks={markObj}
              step={null}
              defaultValue={uniqDatesSorted[uniqDatesSorted.length - 1]}
              value={uniqDatesSorted[index]}
              onChangeComplete={nextValue => {
                setIndex(uniqDatesSorted.indexOf(nextValue as number));
              }}
              className='undp-viz-slider'
            />
          </div>
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
                    UNDPColorModule.categoricalColors.colors[0],
                    UNDPColorModule.categoricalColors.colors[1],
                  ]
                }
                showNAColor={false}
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
                      ? minHeight
                        ? (width || svgWidth) * relativeHeight > minHeight
                          ? (width || svgWidth) * relativeHeight
                          : minHeight
                        : (width || svgWidth) * relativeHeight
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
                  showValues={
                    checkIfNullOrUndefined(showValues)
                      ? true
                      : (showValues as boolean)
                  }
                  onSeriesMouseClick={onSeriesMouseClick}
                  showTicks={showTicks !== false}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                  dateFormat={dateFormat || 'yyyy'}
                  indx={index}
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
