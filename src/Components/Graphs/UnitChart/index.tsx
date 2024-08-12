import { useRef } from 'react';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { UNDPColorModule } from '../../ColorPalette';

interface Props {
  value: number;
  maxValue?: number;
  gridSize?: number;
  fillContainer?: boolean;
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
  graphID?: string;
  graphDownload?: boolean;
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
    graphID,
    graphDownload,
    fillContainer,
  } = props;
  const outOfValue = maxValue === undefined ? 100 : maxValue;
  const paddingValue = unitPadding === undefined ? 3 : unitPadding;
  const graphParentDiv = useRef<HTMLDivElement>(null);
  if (outOfValue < value) {
    console.error('maxValue should be greater than value');
    return null;
  }
  const gridDimension =
    gridSize !== undefined ? (size || 200) / gridSize : (size || 200) / 10;
  const radius = (gridDimension - paddingValue * 2) / 2;
  if (radius <= 0) {
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
        height: 'inherit',
        width: fillContainer === false ? 'fit-content' : '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        flexGrow: size ? 0 : 1,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule.grays['gray-200']
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
            gap: '0.75rem',
            width: '100%',
            justifyContent: 'space-between',
            flexGrow: 1,
          }}
        >
          {graphTitle || graphDescription || graphDownload ? (
            <GraphHeader
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={fillContainer === false ? size || 200 : undefined}
              graphDownload={graphDownload ? graphParentDiv.current : undefined}
            />
          ) : null}
          <div>
            <h2
              className='undp-viz-typography'
              style={{
                width: fillContainer === false ? `${size || 200}px` : '100%',
                fontWeight: 'bold',
                marginBottom: '0.25rem',
                marginTop: 0,
              }}
            >
              {numberFormattingFunction(value, '', '').split('.')[0]} out of{' '}
              {outOfValue}
            </h2>
            <svg
              width={`${size || 200}px`}
              height={`${
                Math.floor(((maxValue || 100) - 1) / (gridSize || 10)) *
                  gridDimension +
                gridDimension / 2 +
                radius +
                5
              }px`}
              viewBox={`0 0 ${size || 200} ${
                Math.floor(((maxValue || 100) - 1) / (gridSize || 10)) *
                  gridDimension +
                gridDimension / 2 +
                radius +
                5
              }`}
            >
              <g>
                {Array.from(
                  Array(maxValue || 100),
                  (_, index) => index + 1,
                ).map(d => (
                  <circle
                    key={d}
                    cx={
                      ((d - 1) % (gridSize || 10)) * gridDimension +
                      gridDimension / 2
                    }
                    cy={
                      Math.floor((d - 1) / (gridSize || 10)) * gridDimension +
                      gridDimension / 2
                    }
                    style={{
                      fill:
                        d <= Math.round(value)
                          ? dotColors || UNDPColorModule.graphMainColor
                          : '#FFF',
                      stroke:
                        d <= Math.round(value)
                          ? dotColors || UNDPColorModule.graphMainColor
                          : '#A9B1B7',
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
              width={fillContainer === false ? size || 200 : undefined}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
