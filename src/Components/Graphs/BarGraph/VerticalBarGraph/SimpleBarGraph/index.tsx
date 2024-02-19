import UNDPColorModule from 'undp-viz-colors';
import uniqBy from 'lodash.uniqby';
import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import { VerticalBarGraphDataType } from '../../../../../Types';
import { GraphHeader } from '../../../../Elements/GraphHeader';
import { GraphFooter } from '../../../../Elements/GraphFooter';

interface Props {
  data: VerticalBarGraphDataType[];
  colors?: string | string[];
  graphTitle?: string;
  width?: number;
  height?: number;
  suffix?: string;
  prefix?: string;
  source?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  barPadding?: number;
  showBarLabel?: boolean;
  showBarValue?: boolean;
  showYTicks?: boolean;
  colorDomain?: string[];
  colorLegendTitle?: string;
  truncateBy?: number;
  backgroundColor?: string | boolean;
  padding?: string;
  leftMargin?: number;
  rightMargin?: number;
  topMargin?: number;
  bottomMargin?: number;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
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
    showBarLabel,
    showBarValue,
    showYTicks,
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
    tooltip,
    onSeriesMouseOver,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight || 480);
      setSvgWidth(graphDiv.current.clientWidth || 620);
    }
  }, [graphDiv?.current]);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: width ? 0 : 1,
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? 'var(--gray-200)'
          : backgroundColor,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 'var(--spacing-05)',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
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
              barColor={
                data.filter(el => el.color).length === 0
                  ? colors
                    ? [colors as string]
                    : ['var(--blue-600)']
                  : (colors as string[]) ||
                    UNDPColorModule.categoricalColors.colors
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
              height={height || svgHeight}
              suffix={suffix || ''}
              prefix={prefix || ''}
              barPadding={barPadding === undefined ? 0.25 : barPadding}
              showBarLabel={showBarLabel === undefined ? true : showBarLabel}
              showBarValue={showBarValue === undefined ? true : showBarValue}
              showYTicks={showYTicks === undefined ? true : showYTicks}
              colorLegendTitle={colorLegendTitle}
              truncateBy={truncateBy === undefined ? 999 : truncateBy}
              leftMargin={leftMargin === undefined ? 20 : leftMargin}
              rightMargin={rightMargin === undefined ? 20 : rightMargin}
              topMargin={
                topMargin === undefined
                  ? data.filter(el => el.color).length !== 0
                    ? 90
                    : 20
                  : topMargin
              }
              bottomMargin={bottomMargin === undefined ? 25 : bottomMargin}
              tooltip={tooltip}
              onSeriesMouseOver={onSeriesMouseOver}
            />
          ) : null}
        </div>
        {source || footNote ? (
          <GraphFooter
            source={source}
            sourceLink={sourceLink}
            footNote={footNote}
          />
        ) : null}
      </div>
    </div>
  );
}
