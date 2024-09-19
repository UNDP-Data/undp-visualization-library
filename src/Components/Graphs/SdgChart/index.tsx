import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { GraphHeader } from '../../Elements/GraphHeader';
import { ScaleDataType, SdgChartDataType } from '../../../Types';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { GraphFooter } from '../../Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '../../Elements/ColorLegendWithMouseOver';
import { LinearColorLegend } from '../../Elements/LinearColorLegend';
import { ThresholdColorLegendWithMouseOver } from '../../Elements/ThresholdColorLegendWithMouseOver';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  data: SdgChartDataType[];
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
  leftMargin?: number;
  rightMargin?: number;
  colorLegendTitle?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  topMargin?: number;
  bottomMargin?: number;
  showValues?: boolean;
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
  highlightTargets?: string[];
  defaultOpacity?: number;
  boxHeight?: number;
  boxPadding?: number;
  showNAColor?: boolean;
}

export function SdgChart(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    leftMargin,
    rightMargin,
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
    highlightTargets,
    defaultOpacity,
    boxHeight,
    boxPadding,
    showNAColor,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );

  const graphDiv = useRef<HTMLDivElement>(null);
  const graphParentDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current, width]);
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
                        ? UNDPColorModule.categoricalColors.colors
                        : domain.length === 2
                        ? [
                            UNDPColorModule.sequentialColors
                              .neutralColorsx09[0],
                            UNDPColorModule.sequentialColors
                              .neutralColorsx09[8],
                          ]
                        : UNDPColorModule.sequentialColors[
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
                        ? UNDPColorModule.categoricalColors.colors
                        : domain.length === 2
                        ? [
                            UNDPColorModule.sequentialColors
                              .neutralColorsx09[0],
                            UNDPColorModule.sequentialColors
                              .neutralColorsx09[8],
                          ]
                        : UNDPColorModule.sequentialColors[
                            `neutralColorsx0${
                              (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                            }`
                          ])
                    }
                    colorDomain={domain as number[]}
                    setSelectedColor={setSelectedColor}
                    naColor={noDataColor || UNDPColorModule.graphGray}
                    rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                    language={language || (rtl ? 'ar' : 'en')}
                  />
                </div>
              ) : (
                <div style={{ marginBottom: '-12px' }}>
                  <LinearColorLegend
                    width={fillContainer !== false ? undefined : width}
                    colorLegendTitle={colorLegendTitle}
                    colors={
                      colors || [
                        UNDPColorModule.sequentialColors.neutralColorsx09[0],
                        UNDPColorModule.sequentialColors.neutralColorsx09[8],
                      ]
                    }
                    colorDomain={domain as number[]}
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
                      ? UNDPColorModule.categoricalColors.colors
                      : domain.length === 2
                      ? [
                          UNDPColorModule.sequentialColors.neutralColorsx09[0],
                          UNDPColorModule.sequentialColors.neutralColorsx09[8],
                        ]
                      : UNDPColorModule.sequentialColors[
                          `neutralColorsx0${
                            (domain.length + 1) as 4 | 5 | 6 | 7 | 8 | 9
                          }`
                        ])
                  }
                  noDataColor={noDataColor || UNDPColorModule.graphGray}
                  scaleType={scale}
                  height={
                    height ||
                    (relativeHeight
                      ? (width || svgWidth) * relativeHeight
                      : svgHeight)
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
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  showTargetLabel={showValues}
                  onSeriesMouseClick={onSeriesMouseClick}
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
                  highlightTargets={highlightTargets || []}
                  defaultOpacity={
                    checkIfNullOrUndefined(defaultOpacity)
                      ? 1
                      : (defaultOpacity as number)
                  }
                  boxHeight={boxHeight || 40}
                  boxPadding={boxPadding || 10}
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
