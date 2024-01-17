import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { format } from 'd3-format';
import { LineChartGraph } from './Graph';
import { TimeSeriesProps } from '../../../types';

interface Props {
  data: TimeSeriesProps[];
  lineColor: string;
  graphTitle: string;
  strokeWidth: number;
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

const StatEl = styled.h3`
  font-size: 4.375rem !important;
  line-height: 0.75 !important;
  text-shadow: none !important;
  -webkit-text-stroke: 2px var(--black) !important;
  color: var(--gray-200) !important;
  letter-spacing: 0.05rem !important;
  margin-top: 0 !important;
  margin-bottom: 1rem !important;
  font-family: var(--fontFamilyHeadings) !important;
`;

const YearEl = styled.span`
  font-size: 2.5rem !important;
  line-height: 1.09 !important;
  text-shadow: none !important;
  -webkit-text-stroke: 0px var(--black) !important;
  color: var(--gray-500) !important;
  margin-top: 0 !important;
  margin-bottom: 1rem !important;
`;

export function LineChart(props: Props) {
  const {
    data,
    lineColor,
    graphTitle,
    strokeWidth,
    suffix,
    source,
    prefix,
    labelFormat,
    graphDescription,
    sourceLink,
    cardWidth,
  } = props;
  const [mouseOverData, setMouseOverData] = useState<TimeSeriesProps>(
    data[data.length - 1],
  );

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
        {data.length > 1 ? (
          <>
            <h2 className='undp-typography bold margin-top-03 margin-bottom-00'>
              {prefix || ''}{' '}
              {Math.abs(mouseOverData.value) < 1
                ? mouseOverData.value
                : format(labelFormat || '.3s')(mouseOverData.value).replace(
                    'G',
                    'B',
                  )}
              {suffix || ''}{' '}
              <span style={{ color: 'var(--gray-500)', fontSize: '1.5rem' }}>
                ({mouseOverData.year})
              </span>
            </h2>
            <div style={{ flexGrow: 1, width: '100%' }} ref={graphDiv}>
              {svgWidth && svgHeight ? (
                <LineChartGraph
                  data={data}
                  lineColor={lineColor}
                  svgWidth={svgWidth}
                  svgHeight={svgHeight}
                  strokeWidth={strokeWidth}
                  setMouseOverData={setMouseOverData}
                  mouseOverData={mouseOverData}
                />
              ) : null}
            </div>
          </>
        ) : (
          <StatEl>
            {prefix || ''}{' '}
            {Math.abs(mouseOverData.value) < 1
              ? mouseOverData.value
              : format(labelFormat || '.3s')(data[0].value).replace('G', 'B')}
            {suffix || ''} <YearEl>({data[0].year})</YearEl>
          </StatEl>
        )}
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
