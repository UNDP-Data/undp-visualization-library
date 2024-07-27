import { useState } from 'react';
import { numberFormattingFunction } from '../../Utils/numberFormattingFunction';

interface Props {
  colors: string[];
  colorDomain: number[];
  colorLegendTitle?: string;
  setSelectedColor: (_d?: string) => void;
  width?: number;
  naColor?: string;
}

export function ThresholdColorLegendWithMouseOver(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    setSelectedColor,
    width,
    naColor,
  } = props;

  const [hoveredColor, setHoveredColor] = useState<string | undefined>(
    undefined,
  );
  const mainColorWidth = naColor ? 320 : 360;
  return (
    <div
      className='flex-div gap-00 flex-wrap flex-hor-align-center'
      style={{
        lineHeight: 0,
        maxWidth: width || 'none',
      }}
    >
      {colorLegendTitle ? (
        <p
          className='undp-typography margin-bottom-03'
          style={{
            fill: 'var(--gray-700)',
            fontSize: '0.875rem',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {colorLegendTitle}
        </p>
      ) : null}
      <svg width='100%' viewBox='0 0 360 30' style={{ maxWidth: '360px' }}>
        <g>
          {colorDomain.map((d, i) => (
            <g
              key={i}
              onMouseOver={() => {
                setHoveredColor(colors[i]);
                setSelectedColor(colors[i]);
              }}
              onMouseLeave={() => {
                setHoveredColor(undefined);
                setSelectedColor(undefined);
              }}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={(i * mainColorWidth) / colors.length + 1}
                y={1}
                width={mainColorWidth / colors.length - 2}
                height={8}
                fill={colors[i]}
                stroke={hoveredColor === colors[i] ? '#212121' : colors[i]}
              />
              <text
                x={((i + 1) * mainColorWidth) / colors.length}
                y={25}
                textAnchor='middle'
                fontSize={12}
                fill='#212121'
                style={{
                  fontFamily: 'var(--fontFamily)',
                }}
              >
                {numberFormattingFunction(d as number, '', '')}
              </text>
            </g>
          ))}
          <g>
            <rect
              onMouseOver={() => {
                setHoveredColor(colors[colorDomain.length]);
                setSelectedColor(colors[colorDomain.length]);
              }}
              onMouseLeave={() => {
                setHoveredColor(undefined);
                setSelectedColor(undefined);
              }}
              x={(colorDomain.length * mainColorWidth) / colors.length + 1}
              y={1}
              width={mainColorWidth / colors.length - 2}
              height={8}
              fill={colors[colorDomain.length]}
              stroke={
                hoveredColor === colors[colorDomain.length]
                  ? '#212121'
                  : colors[colorDomain.length]
              }
              strokeWidth={1}
              style={{ cursor: 'pointer' }}
            />
          </g>
          {naColor ? (
            <g
              onMouseOver={() => {
                setHoveredColor(naColor || '#D4D6D8');
                setSelectedColor(naColor || '#D4D6D8');
              }}
              onMouseLeave={() => {
                setHoveredColor(undefined);
                setSelectedColor(undefined);
              }}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={335}
                y={1}
                width={24}
                height={8}
                fill={naColor || '#D4D6D8'}
                stroke={hoveredColor === naColor ? '#212121' : naColor}
                strokeWidth={1}
              />
              <text
                x={337.5}
                y={25}
                textAnchor='start'
                fontSize={12}
                fill='#212121'
                style={{
                  fontFamily: 'var(--fontFamily)',
                }}
              >
                NA
              </text>
            </g>
          ) : null}
        </g>
      </svg>
    </div>
  );
}
