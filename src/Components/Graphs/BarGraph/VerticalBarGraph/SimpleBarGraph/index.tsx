import uniqBy from 'lodash.uniqby';
import { useEffect, useRef, useState } from 'react';
import sortBy from 'lodash.sortby';
import { Graph } from './Graph';
import { checkIfNullOrUndefined } from '../../../../../Utils/checkIfNullOrUndefined';
import { ReferenceDataType, BarGraphDataType } from '../../../../../Types';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { GraphFooter } from '../../../../Elements/GraphFooter';
import { ColorLegendWithMouseOver } from '../../../../Elements/ColorLegendWithMouseOver';
import { UNDPColorModule } from '../../../../ColorPalette';

interface Props {
  data: BarGraphDataType[];
  colors?: string | string[];
  graphTitle?: string;
  labelOrder?: string[];
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  barPadding?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showTicks?: boolean;
  colorDomain?: string[];
  colorLegendTitle?: string;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  relativeHeight?: number;
  bottomMargin?: number;
  tooltip?: string;
  onSeriesMouseOver?: (_d: any) => void;
  refValues?: ReferenceDataType[];
  showColorScale?: boolean;
  graphID?: string;
  maxValue?: number;
  minValue?: number;
  highlightedDataPoints?: (string | number)[];
  onSeriesMouseClick?: (_d: any) => void;
  graphDownload?: boolean;
  dataDownload?: boolean;
  sortData?: 'asc' | 'desc';
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  showNAColor?: boolean;
  minHeight?: number;
  mode?: 'light' | 'dark';
  maxBarThickness?: number;
}

export function VerticalBarGraph(props: Props) {
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
    showLabels,
    showValues,
    showTicks,
    height,
    width,
    footNote,
    colorDomain,
    colorLegendTitle,
    truncateBy,
    padding,
    backgroundColor,
    topMargin,
    rightMargin,
    leftMargin,
    bottomMargin,
    relativeHeight,
    tooltip,
    onSeriesMouseOver,
    refValues,
    showColorScale,
    graphID,
    maxValue,
    minValue,
    highlightedDataPoints,
    onSeriesMouseClick,
    graphDownload,
    dataDownload,
    sortData,
    labelOrder,
    rtl,
    language,
    showNAColor,
    minHeight,
    mode,
    maxBarThickness,
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
            {showColorScale !== false &&
            data.filter(el => el.color).length !== 0 ? (
              <ColorLegendWithMouseOver
                rtl={rtl}
                language={language}
                width={width}
                colorLegendTitle={colorLegendTitle}
                colors={
                  (colors as string[] | undefined) ||
                  UNDPColorModule[mode || 'light'].categoricalColors.colors
                }
                colorDomain={
                  colorDomain ||
                  (uniqBy(
                    data.filter(el => el.color),
                    'color',
                  ).map(d => d.color) as string[])
                }
                setSelectedColor={setSelectedColor}
                showNAColor={
                  showNAColor === undefined || showNAColor === null
                    ? true
                    : showNAColor
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
                width: '100%',
                lineHeight: 0,
              }}
              ref={graphDiv}
            >
              {(width || svgWidth) && (height || svgHeight) ? (
                <Graph
                  data={
                    sortData === 'asc'
                      ? sortBy(data, d => d.size)
                      : sortData === 'desc'
                      ? sortBy(data, d => d.size).reverse()
                      : data
                  }
                  barColor={
                    data.filter(el => el.color).length === 0
                      ? colors
                        ? [colors as string]
                        : [
                            UNDPColorModule[mode || 'light'].primaryColors[
                              'blue-600'
                            ],
                          ]
                      : (colors as string[] | undefined) ||
                        UNDPColorModule[mode || 'light'].categoricalColors
                          .colors
                  }
                  colorDomain={
                    data.filter(el => el.color).length === 0
                      ? []
                      : colorDomain ||
                        (uniqBy(
                          data.filter(el => el.color),
                          'color',
                        ).map(d => d.color) as string[])
                  }
                  width={width || svgWidth}
                  refValues={refValues}
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
                  barPadding={
                    checkIfNullOrUndefined(barPadding)
                      ? 0.25
                      : (barPadding as number)
                  }
                  showLabels={
                    checkIfNullOrUndefined(showLabels)
                      ? true
                      : (showLabels as boolean)
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
                  truncateBy={
                    checkIfNullOrUndefined(truncateBy)
                      ? 999
                      : (truncateBy as number)
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
                  selectedColor={selectedColor}
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
                  tooltip={tooltip}
                  onSeriesMouseOver={onSeriesMouseOver}
                  maxValue={maxValue}
                  minValue={minValue}
                  highlightedDataPoints={highlightedDataPoints || []}
                  onSeriesMouseClick={onSeriesMouseClick}
                  labelOrder={labelOrder}
                  rtl={checkIfNullOrUndefined(rtl) ? false : (rtl as boolean)}
                  language={language || (rtl ? 'ar' : 'en')}
                  mode={mode || 'light'}
                  maxBarThickness={maxBarThickness}
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
