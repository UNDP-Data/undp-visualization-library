import { useRef } from 'react';
import sum from 'lodash.sum';
import { GraphFooter } from '../../Elements/GraphFooter';
import { GraphHeader } from '../../Elements/GraphHeader';
import { UNDPColorModule } from '../../ColorPalette';
import { UnitChartDataType } from '../../../Types';
import { numberFormattingFunction } from '../../../Utils/numberFormattingFunction';

interface Props {
  data: UnitChartDataType[];
  totalNoOfDots?: number;
  gridSize?: number;
  fillContainer?: boolean;
  unitPadding?: number;
  size?: number;
  graphTitle?: string;
  source?: string;
  colors?: string[];
  graphDescription?: string;
  sourceLink?: string;
  footNote?: string;
  backgroundColor?: string | boolean;
  padding?: string;
  graphID?: string;
  graphDownload?: boolean;
  dataDownload?: boolean;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  graphLegend?: boolean;
  showStrokeForWhiteDots?: boolean;
  note?: string;
  mode?: 'light' | 'dark';
}

export function UnitChart(props: Props) {
  const {
    data,
    size,
    sourceLink,
    graphTitle,
    source,
    colors,
    graphDescription,
    totalNoOfDots,
    unitPadding,
    gridSize,
    footNote,
    padding,
    backgroundColor,
    graphID,
    graphDownload,
    fillContainer,
    rtl,
    language,
    graphLegend,
    showStrokeForWhiteDots,
    note,
    dataDownload,
    mode,
  } = props;
  const maxValue = totalNoOfDots === undefined ? 100 : totalNoOfDots;
  const totalValue = sum(data.map(d => d.value));
  const paddingValue = unitPadding === undefined ? 3 : unitPadding;
  const graphParentDiv = useRef<HTMLDivElement>(null);
  const gridDimension =
    gridSize !== undefined ? (size || 200) / gridSize : (size || 200) / 10;
  const radius = (gridDimension - paddingValue * 2) / 2;
  if (radius <= 0) {
    console.error(
      'The size of single unit is less than or equal to zero. Check values for ((dimension / gridSize) - (padding * 2)) / 2 is not less than or equal to 0.',
    );
    return null;
  }

  const cellsData: { color: string }[] = [];
  data.forEach((item, index) => {
    const count = Math.round((item.value / totalValue) * maxValue);
    for (let i = 0; i < count; i += 1) {
      cellsData.push({
        color: (colors ||
          UNDPColorModule[mode || 'light'].categoricalColors.colors)[index],
      });
    }
  });
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'inherit',
        width: fillContainer === false ? 'fit-content' : '100%',
        flexGrow: size ? 0 : 1,
        backgroundColor: !backgroundColor
          ? 'transparent'
          : backgroundColor === true
          ? UNDPColorModule[mode || 'light'].grays['gray-200']
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
            flexGrow: 1,
          }}
        >
          {graphTitle || graphDescription || graphDownload ? (
            <GraphHeader
              rtl={rtl}
              language={language}
              graphTitle={graphTitle}
              graphDescription={graphDescription}
              width={fillContainer === false ? size || 200 : undefined}
              graphDownload={graphDownload ? graphParentDiv.current : undefined}
              dataDownload={
                dataDownload &&
                data.map(d => d.data).filter(d => d !== undefined).length > 0
                  ? data.map(d => d.data).filter(d => d !== undefined)
                  : null
              }
              mode={mode || 'light'}
            />
          ) : null}
          {note ? (
            <h2
              className='undp-viz-typography'
              style={{
                width: fillContainer === false ? `${size || 200}px` : '100%',
                fontWeight: 'bold',
                marginBottom: '0.25rem',
                marginTop: 0,
                color: UNDPColorModule[mode || 'light'].grays.black,
              }}
            >
              {note}
            </h2>
          ) : null}
          {graphLegend !== false ? (
            <div
              style={{
                lineHeight: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  marginBottom: 0,
                  flexWrap: 'wrap',
                  rowGap: '0',
                  columnGap: '1rem',
                }}
              >
                {data.map((d, i) => (
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center',
                    }}
                    key={i}
                  >
                    <div
                      style={{
                        width: '0.75rem',
                        height: '0.75rem',
                        borderRadius: '1rem',
                        backgroundColor: colors
                          ? colors[i]
                          : UNDPColorModule[mode || 'light'].categoricalColors
                              .colors[i],
                      }}
                    />
                    <p
                      className={`${
                        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
                      }undp-viz-typography`}
                      style={{
                        marginBottom: 0,
                        fontSize: '0.875rem',
                        color: UNDPColorModule[mode || 'light'].grays.black,
                      }}
                    >
                      {d.label}:{' '}
                      <span style={{ fontWeight: 'bold', fontSize: 'inherit' }}>
                        {numberFormattingFunction(d.value)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <svg
              width={`${size || 200}px`}
              height={`${
                Math.floor((maxValue - 1) / (gridSize || 10)) * gridDimension +
                gridDimension / 2 +
                radius +
                5
              }px`}
              viewBox={`0 0 ${size || 200} ${
                Math.floor((maxValue - 1) / (gridSize || 10)) * gridDimension +
                gridDimension / 2 +
                radius +
                5
              }`}
            >
              <g>
                {cellsData.map((d, i) => (
                  <circle
                    key={i}
                    cx={
                      (i % (gridSize || 10)) * gridDimension + gridDimension / 2
                    }
                    cy={
                      Math.floor(i / (gridSize || 10)) * gridDimension +
                      gridDimension / 2
                    }
                    style={{
                      fill: d.color,
                      stroke:
                        (d.color.toLowerCase() === '#fff' ||
                          d.color.toLowerCase() === '#ffffff' ||
                          d.color.toLowerCase() === 'white') &&
                        showStrokeForWhiteDots !== false
                          ? UNDPColorModule[mode || 'light'].grays['gray-400']
                          : d.color,
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
              rtl={rtl}
              language={language}
              source={source}
              sourceLink={sourceLink}
              footNote={footNote}
              width={fillContainer === false ? size || 200 : undefined}
              mode={mode || 'light'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
