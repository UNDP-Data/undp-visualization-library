import { format } from 'd3-format';
import flattenDeep from 'lodash.flattendeep';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import uniqBy from 'lodash.uniqby';
import sortBy from 'lodash.sortby';
import sumBy from 'lodash.sumby';
import { StackedAreaChartGraph } from './Graph';
import { checkIfNullOrUndefined } from '../../../Utils/checkIfNullOrUndefined';
import { TimeSeriesProps } from '../../../types';

interface DataFormattedType {
  year: number;
  parameters: (number | undefined)[];
  total?: number;
}

interface Props {
  data: TimeSeriesProps[][];
  lineColors: string[];
  keys: string[];
  graphTitle: string;
  source: string;
  graphDescription?: string;
  cardWidth?: string;
}

interface WidthProps {
  cardWidth?: string;
}

const StatCardsEl = styled.div<WidthProps>`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1 0
    ${props =>
      props.cardWidth ? `calc(${props.cardWidth} - 4rem)` : '18.5rem'};
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

export function StackedAreaChart(props: Props) {
  const {
    data,
    lineColors,
    keys,
    graphTitle,
    source,
    graphDescription,
    cardWidth,
  } = props;
  const flattenData = flattenDeep(data);

  const yearArray = sortBy(
    uniqBy(flattenData, d => d.year),
    d => d.year,
  ).map(d => d.year);

  const dataFormatted: DataFormattedType[] = [];
  yearArray.forEach(yr => {
    dataFormatted.push({
      parameters: data.map(d =>
        d.findIndex(el => el.year === yr) !== -1
          ? d[d.findIndex(el => el.year === yr)].value
          : undefined,
      ),
      year: yr,
      total: sumBy(
        flattenData.filter(d => d.year === yr),
        d => d.value,
      ),
    });
  });
  const [mouseOverData, setMouseOverData] = useState<DataFormattedType>(
    dataFormatted[dataFormatted.length - 1],
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
        className='flex-div flex-wrap gap-05 margin-top-03'
        style={{ padding: '0 var(--spacing-07)' }}
      >
        {keys.map((key, i) => (
          <div className='flex-div gap-03 flex-vert-align-center' key={i}>
            <div
              style={{
                width: '1rem',
                height: '1rem',
                backgroundColor: lineColors[i],
              }}
            />
            <p className='undp-typography margin-bottom-00'>
              {key}:{' '}
              <span className='bold'>
                {!checkIfNullOrUndefined(mouseOverData.parameters[i])
                  ? (mouseOverData.parameters[i] as number) > 1000
                    ? format('.3s')(mouseOverData.parameters[i] as number)
                    : mouseOverData.parameters[i]
                  : 'NA'}
              </span>{' '}
              ({mouseOverData.year})
            </p>
          </div>
        ))}
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
            <StackedAreaChartGraph
              keys={keys}
              data={dataFormatted}
              lineColors={lineColors}
              svgWidth={svgWidth}
              svgHeight={svgHeight}
              setMouseOverData={setMouseOverData}
              mouseOverData={mouseOverData}
            />
          ) : null}
        </div>
      </div>
      <SourceEl className='margin-top-05'>Source: {source}</SourceEl>
    </StatCardsEl>
  );
}
