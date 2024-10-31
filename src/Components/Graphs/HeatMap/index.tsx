import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { GraphHeader } from '../../Elements/GraphHeader';
import { HeatMapDataType, ScaleDataType } from '../../../Types';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { GraphFooter } from '../../Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '../../Elements/ColorLegendWithMouseOver';
import { LinearColorLegend } from '../../Elements/LinearColorLegend';
import { ThresholdColorLegendWithMouseOver } from '../../Elements/ThresholdColorLegendWithMouseOver';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: HeatMapDataType[];
  colors?: string[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  scaleType?: ScaleDataType;
  domain: number[] | string[];
  showColumnLabels?: boolean;
  leftMargin?: number;
  rightMargin?: number;
  truncateBy?: number;
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  suffix?: string;
  prefix?: string;
  showValues?: boolean;
  showRowLabels?: boolean;
  relativeHeight?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  graphID?: string;
  noDataColor?: string;
  showColorScale?: boolean;
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  fillContainer?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  showNAColor?: boolean;
  minHeight?: number;
  mode?: 'light' | 'dark';
}

export function HeatMap(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    showColumnLabels,
    leftMargin,
    rightMargin,
    truncateBy,
    height,
    width,
    scaleType,
    domain,
    footNote,
    colorLegendTitle,
    padding,
    backgroundColor,
    topMargin,
    bottomMargin,
    tooltip,
    onSeriesMouseOver,
    suffix,
    prefix,
    showRowLabels,
    relativeHeight,
    showValues,
    graphID,
    noDataColor,
    showColorScale,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    fillContainer,
    rtl,
    language,
    showNAColor,
    minHeight,
    mode,
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
  }, [graphDiv?.current, width, height]);
  const scale =
    scaleType ||
    (typeof domain[0] === 'string'
      ? 'categorical'
      : domain.length === 2
      ? 'linear'
      : 'threshold');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: fillContainer === false ? 'fit-content' : '100%',
        height: 'inherit',
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
            gap: '1rem',
            width: '100%',
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
            {showColorScale !== false ? (
              scale === 'categorical' ? (
                <div style={{ marginBottom: '-12px' }}>
                  <ColorLegendWithMouseOver
                    rtl={rtl}
                    language={language}
                    width={fillContainer !== false ? undefined : width}
                    colorLegendTitle={colorLegendTitle}
                    colors={
                      colors ||
                      (typeof domain[0] === 'string'
                        ? UNDPColorModule[mode || 'light'].categoricalColors
                            .colors
                        : domain.length === 2
                        ? [
                            UNDPColorModule[mode || 'light'].sequentialColors
                              .neutralColorsx09[0],
                            UNDPColorModule[mode || 'light'].sequentialColors
                              .neutralColorsx09[8],
                          ]
                        : UNDPColorModule[mode || 'light'].sequentialColors[
                            `neutralColorsx0${
                              (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                            }`
                          ])
                    }
                    colorDomain={domain.map(d => `${d}`)}
                    setSelectedColor={setSelectedColor}
                    showNAColor={
                      showNAColor === undefined || showNAColor === null
                        ? true
                        : showNAColor
                    }
                    mode={mode || 'light'}
                  />
                </div>
              ) : scale === 'threshold' ? (
                <div style={{ marginBottom: '-12px' }}>
                  <ThresholdColorLegendWithMouseOver
                    width={fillContainer !== false ? undefined : width}
                    colorLegendTitle={colorLegendTitle}
                    colors={
                      colors ||
                      (typeof domain[0] === 'string'
                        ? UNDPColorModule[mode || 'light'].categoricalColors
                            .colors
                        : domain.length === 2
                        ? [
                            UNDPColorModule[mode || 'light'].sequentialColors
                              .neutralColorsx09[0],
                            UNDPColorModule[mode || 'light'].sequentialColors
                              .neutralColorsx09[8],
                          ]
                        : UNDPColorModule[mode || 'light'].sequentialColors[
                            `neutralColorsx0${
                              (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                            }`
                          ])
                    }
                    colorDomain={domain as number[]}
                    setSelectedColor={setSelectedColor}
                    naColor={
                      noDataColor || UNDPColorModule[mode || 'light'].graphGray
                    }
                    rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                    language={language || (rtl ? 'ar' : 'en')}
                    mode={mode || 'light'}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '-12px' }}>
                  <LinearColorLegend
                    width={fillContainer !== false ? undefined : width}
                    colorLegendTitle={colorLegendTitle}
                    colors={
                      colors || [
                        UNDPColorModule[mode || 'light'].sequentialColors
                          .neutralColorsx09[0],
                        UNDPColorModule[mode || 'light'].sequentialColors
                          .neutralColorsx09[8],
                      ]
                    }
                    colorDomain={domain as number[]}
                    mode={mode || 'light'}
                    rtl={rtl}
                    language={language}
                  />
                </div>
              )
            ) : null}
            <div
              style={{
                flexGrow: 1,
                flexDirection: 'column',
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                width: '100%',
                lineHeight: 0,
              }}
              ref={graphDiv}
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={data}
                  domain={domain}
                  width={width || svgWidth}
                  colors={
                    colors ||
                    (typeof domain[0] === 'string'
                      ? UNDPColorModule[mode || 'light'].categoricalColors
                          .colors
                      : domain.length === 2
                      ? [
                          UNDPColorModule[mode || 'light'].sequentialColors
                            .neutralColorsx09[0],
                          UNDPColorModule[mode || 'light'].sequentialColors
                            .neutralColorsx09[8],
                        ]
                      : UNDPColorModule[mode || 'light'].sequentialColors[
                          `neutralColorsx0${
                            (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                          }`
                        ])
                  }
                  noDataColor={
                    noDataColor || UNDPColorModule[mode || 'light'].graphGray
                  }
                  scaleType={scale}
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
                  showColumnLabels={
                    checkIfNullOrUndefined(showColumnLabels)
                      ? true
                      : (showColumnLabels as boolean)
                  }
                  leftMargin={
                    checkIfNullOrUndefined(leftMargin)
                      ? 100
                      : (leftMargin as number)
                  }
                  rightMargin={
                    checkIfNullOrUndefined(rightMargin)
                      ? 10
                      : (rightMargin as number)
                  }
                  topMargin={
                    checkIfNullOrUndefined(topMargin)
                      ? 30
                      : (topMargin as number)
                  }
                  bottomMargin={
                    checkIfNullOrUndefined(bottomMargin)
                      ? 10
                      : (bottomMargin as number)
                  }
                  selectedColor={selectedColor}
                  truncateBy={
                    checkIfNullOrUndefined(truncateBy)
                      ? 999
                      : (truncateBy as number)
                  }
                  showRowLabels={
                    checkIfNullOrUndefined(showRowLabels)
                      ? true
                      : (showRowLabels as boolean)
                  }
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showValues={showValues}
                  suffix={suffix || ''}
                  prefix={prefix || ''}
                  onSeriesMouseClick={onSeriesMouseClick}
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
                  mode={mode || 'light'}
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
