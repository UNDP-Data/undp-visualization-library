import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Graph } from './Graph';
import { BarGraphProps } from '../../../types';

interface Props {
  data: BarGraphProps[];
  color: string;
  graphTitle: string;
  suffix?: string;
  prefix?: string;
  labelFormat?: string;
  source: string;
  graphDescription?: string;
  sourceLink?: string;
  cardWidth?: string;
}

interface WidthProps {
  cardWidth?: string;
}

const StatCardsEl = styled.div<WidthProps>`
  display: flex;
  flex-direction: column;
  flex: 1 0 ${props => props.cardWidth || '22.5rem'};
  min-width: 22.5rem;
  min-height: 22.5rem;
  background-color: var(--gray-200);
  justify-content: space-between;
  font-size: 1.25rem;
  color: var(--black);
  transition: 300ms all;
  height: auto !important;
  scroll-snap-align: start;
`;

const SourceEl = styled.div`
  font-size: 1rem;
  color: var(--gray-500);
  padding: 0 var(--spacing-07);
`;

export function HorizontalBarGraph(props: Props) {
  const {
    data,
    graphTitle,
    color,
    suffix,
    source,
    prefix,
    labelFormat,
    graphDescription,
    sourceLink,
    cardWidth,
  } = props;

  const [svgWidth, setSvgWidth] = useState(0);
  const [svgHeight, setSvgHeight] = useState(0);

  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (graphDiv.current) {
      setSvgHeight(graphDiv.current.clientHeight);
      setSvgWidth(graphDiv.current.clientWidth);
    }
  }, [graphDiv?.current]);
  return (
    <StatCardsEl cardWidth={cardWidth}>
      <div
        style={{
          padding: '0 var(--spacing-07)',
        }}
      >
        <p className='undp-typography margin-bottom-00'>{graphTitle}</p>
        {graphDescription ? (
          <p
            className='undp-typography small-font margin-bottom-00'
            style={{ color: 'var(--gray-500)' }}
          >
            {graphDescription}
          </p>
        ) : null}
      </div>
      <div
        style={{
          flexGrow: 1,
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'center',
          padding: '0 var(--spacing-07)',
        }}
      >
        <div style={{ flexGrow: 1, width: '100%' }} ref={graphDiv}>
          {svgWidth && svgHeight ? (
            <Graph
              data={data}
              barColor={color}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              labelFormat={labelFormat}
              suffix={suffix}
              prefix={prefix}
            />
          ) : null}
        </div>
      </div>
      <SourceEl className='margin-top-05'>
        Source:{' '}
        {sourceLink ? (
          <a
            className='undp-style'
            style={{ color: 'var(--gray-500)' }}
            href={sourceLink}
            target='_blank'
            rel='noreferrer'
          >
            {source}
          </a>
        ) : (
          source
        )}
      </SourceEl>
    </StatCardsEl>
  );
}
