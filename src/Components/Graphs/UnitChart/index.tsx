import { GraphTitle } from '../../Typography/GraphTitle';
import { GraphDescription } from '../../Typography/GraphDescription';
import { FootNote } from '../../Typography/FootNote';
import { Source } from '../../Typography/Source';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';

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
          gap: 'var(--spacing-05)',
          width: '100%',
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
          <div>
            {source ? <Source text={source} link={sourceLink} /> : null}
            {footNote ? <FootNote text={footNote} /> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
