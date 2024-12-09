import { useState } from 'react';
import { numberFormattingFunction } from '../../Utils/numberFormattingFunction';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  colors: string[];
  colorDomain: number[];
  colorLegendTitle?: string;
  setSelectedColor: (_d?: string) => void;
  width?: number;
  naColor?: string;
  rtl: boolean;
  language: 'en' | 'he' | 'ar';
  mode: 'dark' | 'light';
}

export function ThresholdColorLegendWithMouseOver(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    setSelectedColor,
    width,
    naColor,
    rtl,
    language,
    mode,
  } = props;

  const [hoveredColor, setHoveredColor] = useState<string | undefined>(
    undefined,
  );
  const mainColorWidth = naColor ? 320 : 360;
  return (
    <div
      style={{
        lineHeight: 0,
        maxWidth: width || 'none',
        display: 'flex',
        gap: 0,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
      aria-label='Color legend'
    >
      {colorLegendTitle && colorLegendTitle !== '' ? (
        <p
          className={`${
            rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
          }undp-viz-typography`}
          style={{
            color: UNDPColorModule[mode].grays['gray-700'],
            fontSize: '0.875rem',
            width: '100%',
            textAlign: 'center',
            marginBottom: '0.5rem',
            marginTop: 0,
            lineHeight: 1.4,
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
                stroke={
                  hoveredColor === colors[i]
                    ? UNDPColorModule[mode].grays['gray-700']
                    : colors[i]
                }
              />
              <text
                x={((i + 1) * mainColorWidth) / colors.length}
                y={25}
                textAnchor='middle'
                fontSize={12}
                style={{
                  fill: UNDPColorModule[mode].grays['gray-700'],
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
                  ? UNDPColorModule[mode].grays['gray-700']
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
                stroke={
                  hoveredColor === naColor
                    ? UNDPColorModule[mode].grays['gray-700']
                    : naColor
                }
                strokeWidth={1}
              />
              <text
                x={337.5}
                y={25}
                textAnchor='start'
                fontSize={12}
                style={{
                  fill: UNDPColorModule[mode].grays['gray-700'],
                  fontFamily: rtl
                    ? language === 'he'
                      ? 'Noto Sans Hebrew, sans-serif'
                      : 'Noto Sans Arabic, sans-serif'
                    : 'ProximaNova, proxima-nova, Helvetica Neue, Roboto, sans-serif',
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
