import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import {
  BackgroundStyleDataType,
  CSSObject,
  LineChartDataType,
  SourcesDataType,
} from '../../../../Types';
import { GraphFooter } from '../../../Elements/GraphFooter';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { UNDPColorModule } from '../../../ColorPalette';
import { generateRandomString } from '../../../../Utils/generateRandomString';

interface Props {
  data: LineChartDataType[];
  color?: string;
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  width?: number;
  height?: number;
  sources?: SourcesDataType[];
  dateFormat?: string;
  area?: boolean;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  graphDownload?: boolean;
  dataDownload?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  minHeight?: number;
  mode?: 'light' | 'dark';
  ariaLabel?: string;
  backgroundStyle?: BackgroundStyleDataType;
  tooltipBackgroundStyle?: CSSObject;
}

export function SparkLine(props: Props) {
  const {
    data,
    graphTitle,
    color,
    sources,
    graphDescription,
    height,
    width,
    footNote,
    dateFormat = 'yyyy',
    area = false,
    padding,
    backgroundColor,
    leftMargin = 5,
    rightMargin = 5,
    topMargin = 10,
    bottomMargin = 20,
    tooltip,
    relativeHeight,
    onSeriesMouseOver,
    graphID,
    minValue,
    maxValue,
    graphDownload = false,
    dataDownload = false,
    rtl = false,
    language = 'en',
    minHeight = 0,
    mode = 'light',
    ariaLabel,
    backgroundStyle = {},
    tooltipBackgroundStyle = {
      backgroundColor: UNDPColorModule[mode].grays['gray-200'],
      border: `1px solid ${UNDPColorModule[mode].grays['gray-300']}`,
      maxWidth: '24rem',
      padding: '0.5rem',
    },
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
  }, [width, height]);

  return (
    <div
      style={{
        ...backgroundStyle,
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
          ? UNDPColorModule[mode].grays['gray-200']
          : backgroundColor,
      }}
      id={graphID}
      ref={graphParentDiv}
      aria-label={
        ariaLabel ||
        `${
          graphTitle ? `The graph shows ${graphTitle}. ` : ''
        }This is a line chart that show trends over time.${
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
              mode={mode}
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
                color={color || UNDPColorModule[mode].primaryColors['blue-600']}
                width={width || svgWidth}
                height={Math.max(
                  minHeight,
                  height ||
                    (relativeHeight
                      ? minHeight
                        ? (width || svgWidth) * relativeHeight > minHeight
                          ? (width || svgWidth) * relativeHeight
                          : minHeight
                        : (width || svgWidth) * relativeHeight
                      : svgHeight),
                )}
                dateFormat={dateFormat}
                areaId={area ? generateRandomString(8) : undefined}
                leftMargin={leftMargin}
                rightMargin={rightMargin}
                topMargin={topMargin}
                bottomMargin={bottomMargin}
                tooltip={tooltip}
                onSeriesMouseOver={onSeriesMouseOver}
                minValue={minValue}
                maxValue={maxValue}
                rtl={rtl}
                language={language}
                mode={mode}
                tooltipBackgroundStyle={tooltipBackgroundStyle}
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
              mode={mode}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
