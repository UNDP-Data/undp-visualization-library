import { useState, useRef, useEffect } from 'react';
import { format, parse } from 'date-fns';
import uniqBy from 'lodash.uniqby';
import { ascending, sort } from 'd3-array';
import Slider from 'rc-slider';
import { Graph } from './Graph';
import { DumbbellChartWithDateDataType } from '../../../../../Types';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { ColorLegendWithMouseOver } from '../../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../../ColorPalette';
import { Pause, Play } from '../../../../Icons/Icons';
import 'rc-slider/assets/index.css';

interface Props {
  data: DumbbellChartWithDateDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  barPadding?: number;
  showValues?: boolean;
  showTicks?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  truncateBy?: number;
  colorDomain: string[];
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  radius?: number;
  relativeHeight?: number;
  showLabels?: boolean;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxPositionValue?: number;
  minPositionValue?: number;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  sortParameter?: number | 'diff';
  dateFormat?: string;
  showOnlyActiveDate?: boolean;
  autoPlay?: boolean;
  arrowConnector?: boolean;
  connectorStrokeWidth?: number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
  minBarThickness?: number;
}

export function AnimatedHorizontalDumbbellChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    suffix,
    source,
    prefix,
    graphDescription,
    sourceLink,
    barPadding,
    showValues,
    showTicks,
    leftMargin,
    rightMargin,
    topMargin,
    bottomMargin,
    truncateBy,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    padding,
    backgroundColor,
    radius,
    tooltip,
    showLabels,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    maxPositionValue,
    minPositionValue,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    sortParameter,
    showOnlyActiveDate,
    autoPlay,
    dateFormat,
    arrowConnector,
    connectorStrokeWidth,
    rtl,
    language,
    minHeight,
    mode,
    maxBarThickness,
    minBarThickness,
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
    });
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
      if (!width) resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, [graphDiv?.current, width]);

  const dotColors =
    colors || UNDPColorModule[mode || 'light'].categoricalColors.colors;

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
        height: 'inherit',
        width: width ? 'fit-content' : '100%',
        flexGrow: width ? 0 : 1,
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
              {play ? (
                <Pause mode={mode || 'light'} />
              ) : (
                <Play mode={mode || 'light'} />
              )}
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
              onChange={nextValue => {
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
            <ColorLegendWithMouseOver
              rtl={rtl}
              language={language}
              width={width}
              colorDomain={colorDomain}
              colors={dotColors}
              colorLegendTitle={colorLegendTitle}
              setSelectedColor={setSelectedColor}
              showNAColor={false}
              mode={mode || 'light'}
            />
            <div
              style={{
                flexGrow: 1,
                width: '100%',
                lineHeight: 0,
                display: 'flex',
                justifyContent: 'center',
              }}
              ref={graphDiv}
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  dotColors={dotColors}
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
                  radius={!radius ? 3 : radius}
                  barPadding={
                    checkIfNullOrUndefined(barPadding)
                      ? 0.25
                      : (barPadding as number)
                  }
                  showValues={
                    checkIfNullOrUndefined(showValues)
                      ? true
                      : (showValues as boolean)
                  }
                  showTicks={
                    checkIfNullOrUndefined(showTicks)
                      ? true
                      : (showTicks as boolean)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 100
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? 40
                      : (rightMargin as number)
                  }
                  topMargin={
                    checkIfNullOrUndefined(topMargin)
                      ? 20
                      : (topMargin as number)
                  }
                  bottomMargin={
                    checkIfNullOrUndefined(bottomMargin)
                      ? 10
                      : (bottomMargin as number)
                  }
                  truncateBy={
                    checkIfNullOrUndefined(truncateBy)
                      ? 999
                      : (truncateBy as number)
                  }
                  showLabels={
                    checkIfNullOrUndefined(showLabels)
                      ? true
                      : (showLabels as boolean)
                  }
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  maxPositionValue={maxPositionValue}
                  minPositionValue={minPositionValue}
                  onSeriesMouseClick={onSeriesMouseClick}
                  selectedColor={selectedColor}
                  dateFormat={dateFormat || 'yyyy'}
                  indx={index}
                  sortParameter={sortParameter}
                  arrowConnector={
                    checkIfNullOrUndefined(arrowConnector)
                      ? false
                      : (arrowConnector as boolean)
                  }
                  connectorStrokeWidth={
                    checkIfNullOrUndefined(connectorStrokeWidth)
                      ? 2
                      : (connectorStrokeWidth as number)
                  }
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
                  mode={mode || 'light'}
                  maxBarThickness={maxBarThickness}
                  minBarThickness={minBarThickness}
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
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
