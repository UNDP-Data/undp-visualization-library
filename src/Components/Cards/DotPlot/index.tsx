import styled from 'styled-components';

interface Props {
  value: number;
  year: number;
  size: number;
  graphTitle: string;
  source: string;
  dotColors?: string;
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
  justify-content: space-between;
  flex: 1 0 ${props => props.cardWidth || '22.5rem'};
  min-width: 22.5rem;
  min-height: 22.5rem;
  background-color: var(--gray-200);
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

export function DotPlot(props: Props) {
  const {
    value,
    size,
    sourceLink,
    graphTitle,
    year,
    source,
    dotColors,
    graphDescription,
    cardWidth,
  } = props;
  const margin = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
  const gridSize = (size - margin.left - margin.right) / 10;
  const radius = (gridSize - 6) / 2;
  return (
    <StatCardsEl cardWidth={cardWidth}>
      <div
        style={{
          padding: '0 var(--spacing-07)',
        }}
      >
        <p className='undp-typography margin-bottom-00'>
          {graphTitle} ({year})
        </p>
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
          padding: '0 var(--spacing-07)',
        }}
      >
        <h2 className='undp-typography bold margin-bottom-02 margin-top-03'>
          {value} out of 100
        </h2>
        <svg
          style={{ maxWidth: '15rem', margin: '0' }}
          width='100%'
          viewBox={`0 0 ${size} ${size}`}
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {Array.from(Array(100), (_, index) => index + 1).map(d => (
              <circle
                key={d}
                cx={((d - 1) % 10) * gridSize + gridSize / 2}
                cy={Math.floor((d - 1) / 10) * gridSize + gridSize / 2}
                style={{
                  fill:
                    d <= Math.round(value)
                      ? dotColors || 'var(--dark-green)'
                      : 'var(--white)',
                  stroke:
                    d <= Math.round(value)
                      ? dotColors || 'var(--dark-green)'
                      : 'var(--gray-500)',
                  strokeWidth: 1,
                }}
                r={radius}
              />
            ))}
          </g>
        </svg>
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
