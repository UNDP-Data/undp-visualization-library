import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';

interface Props {
  value: number;
  maxValue?: number;
  gridSize?: number;
  unitPadding?: number;
  size?: number;
  graphTitle?: string;
  source?: string;
  dotColors?: string;
  graphDescription?: string;
  sourceLink?: string;
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
}

export function UnitChart(props: Props) {
  const {
    value,
    size,
    sourceLink,
    graphTitle,
    source,
    dotColors,
    graphDescription,
    maxValue,
    unitPadding,
    gridSize,
    footNote,
    padding,
    backgroundColor,
  } = props;
  const outOfValue = maxValue === undefined ? 100 : maxValue;
  const paddingValue = unitPadding === undefined ? 3 : unitPadding;
  if (outOfValue < value) {
    // eslint-disable-next-line no-console
    console.error('maxValue should be greater than value');
    return null;
  }
  const gridDimension =
    gridSize !== undefined ? (size || 200) / gridSize : (size || 200) / 10;
  const radius = (gridDimension - paddingValue * 2) / 2;
  if (radius <= 0) {
    // eslint-disable-next-line no-console
    console.error(
      'The size of single unit is less than or equal to zero. Check values for ((dimension / gridSize) - (padding * 2)) / 2 is not less than or equal to 0.',
    );
    return null;
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 'fit-content',
        flexGrow: size ? 0 : 1,
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
          gap: 'var(--spacing-05)',
          width: '100%',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        {graphTitle || graphDescription ? (
          <GraphHeader
            graphTitle={graphTitle}
            graphDescription={graphDescription}
          />
        ) : null}
        <div>
          <h2 className='undp-typography bold margin-bottom-02 margin-top-03'>
            {numberFormattingFunction(value)} out of {outOfValue}
          </h2>
          <svg
            width={`${size || 200}px`}
            height={`${size || 200}px`}
            viewBox={`0 0 ${size || 200} ${size || 200}`}
          >
            <g>
              {Array.from(Array(100), (_, index) => index + 1).map(d => (
                <circle
                  key={d}
                  cx={((d - 1) % 10) * gridDimension + gridDimension / 2}
                  cy={
                    Math.floor((d - 1) / 10) * gridDimension + gridDimension / 2
                  }
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
