import UNDPColorModule from 'undp-viz-colors';
import { useState, useRef, useEffect } from 'react';
import { Graph } from './Graph';
import { ChoroplethMapDataType } from '../../../../Types';
import { Source } from '../../../Typography/Source';
import { GraphTitle } from '../../../Typography/GraphTitle';
import { GraphDescription } from '../../../Typography/GraphDescription';
import { FootNote } from '../../../Typography/FootNote';

interface Props {
  graphTitle?: string;
  graphDescription?: string;
  footNote?: string;
  sourceLink?: string;
  width?: number;
  height?: number;
  source?: string;
  domain: number[];
  colors: string[];
  colorLegendTitle: string;
  categorical?: boolean;
  data: ChoroplethMapDataType[];
  scale?: number;
  centerPoint?: [number, number];
  backgroundColor?: string | boolean;
  padding?: string;
}

export function ChoroplethMap(props: Props) {
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
    domain,
    colorLegendTitle,
    categorical,
    scale,
    centerPoint,
    padding,
    backgroundColor,
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
        width: '100%',
        padding: backgroundColor
          ? padding || 'var(--spacing-05)'
          : padding || 0,
        flexGrow: 1,
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
          <div>
            {graphTitle ? <GraphTitle text={graphTitle} /> : null}
            {graphDescription ? (
              <GraphDescription text={graphDescription} />
            ) : null}
          </div>
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
              domain={domain}
              width={width || svgWidth}
              height={height || svgHeight}
              scale={scale || 180}
              centerPoint={centerPoint || [470, 315]}
              colors={
                colors ||
                UNDPColorModule.sequentialColors[
                  `neutralColorsx0${domain.length as 4 | 5 | 6 | 7 | 8 | 9}`
                ]
              }
              colorLegendTitle={colorLegendTitle || 'Color key'}
              categorical={categorical}
            />
          ) : null}
        </div>
        {source || footNote ? (
          <div>
            {source ? <Source text={source} link={sourceLink} /> : null}
            {footNote ? <FootNote text={footNote} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
