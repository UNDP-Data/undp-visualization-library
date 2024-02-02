import UNDPColorModule from 'undp-viz-colors';
import { useEffect, useRef, useState } from 'react';
import { Graph } from './Graph';
import { BivariateMapDataType } from '../../../../Types';
import { GraphHeader } from '../../../Elements/GraphHeader';
import { GraphFooter } from '../../../Elements/GraphFooter';

interface Props {
  data: BivariateMapDataType[];
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  xColorLegendTitle?: string;
  yColorLegendTitle?: string;
  xDomain: [number, number, number, number];
  yDomain: [number, number, number, number];
  colors?: string[][];
  scale?: number;
  centerPoint?: [number, number];
  backgroundColor?: string | boolean;
  padding?: string;
  tooltip?: (_d: any) => JSX.Element;
  onSeriesMouseOver?: (_d: any) => void;
}

export function BiVariantMap(props: Props) {
  const {
    data,
    graphTitle,
    colors,
    source,
    graphDescription,
    sourceLink,
    height,
    width,
    footNote,
    xDomain,
    yDomain,
    xColorLegendTitle,
    yColorLegendTitle,
    scale,
    centerPoint,
    padding,
    backgroundColor,
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
          ? 'var(--gray-100)'
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
              xDomain={xDomain}
              yDomain={yDomain}
              width={width || svgWidth}
              height={height || svgHeight}
              scale={scale || 180}
              centerPoint={centerPoint || [470, 315]}
              colors={colors || UNDPColorModule.bivariateColors.colors05x05}
              xColorLegendTitle={xColorLegendTitle || 'X Color key'}
              yColorLegendTitle={yColorLegendTitle || 'Y Color key'}
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
