import { P } from '@undp-data/undp-design-system-react';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  colors: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  showNAColor: boolean;
  width?: number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  isCenter?: boolean;
  mode: 'dark' | 'light';
}

export function ColorLegend(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    showNAColor,
    width,
    rtl,
    language,
    isCenter,
    mode,
  } = props;

  return (
    <div
      className={`flex ${
        isCenter ? 'justify-center' : rtl ? 'justify-end' : 'justify-start'
      } leading-0`}
      style={{
        maxWidth: width ? `${width}px` : 'none',
      }}
      aria-label='Color legend'
    >
      <div>
        {colorLegendTitle && colorLegendTitle !== '' ? (
          <P
            className={`${
              rtl ? `font-sans-${language || 'ar'} ` : ''
            }font-sans text-sm md:text-sm mb-2 md:mb-2 ${
              isCenter ? 'text-center' : rtl ? 'text-right' : 'text-left'
            }`}
            style={{
              color: UNDPColorModule[mode].grays['gray-700'],
            }}
          >
            {colorLegendTitle}
          </P>
        ) : null}
        <div
          className={`flex flex-wrap mb-0 ${
            rtl ? 'flex-row-reverse' : 'flex-row'
          }`}
          style={{
            gap: '0.875rem',
          }}
        >
          {colorDomain.map((d, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 ${
                rtl ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: colors[i % colors.length],
                }}
              />
              {d === '' ? null : (
                <P
                  className={`${
                    rtl ? `font-sans-${language || 'ar'} ` : ''
                  }font-sans text-sm md:text-sm mb-0 md:mb-0`}
                  style={{
                    color: UNDPColorModule[mode].grays.black,
                  }}
                >
                  {d}
                </P>
              )}
            </div>
          ))}
          {showNAColor ? (
            <div
              className={`flex items-center gap-1 ${
                rtl ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: UNDPColorModule[mode].graphGray,
                }}
              />
              <p
                className={`${
                  rtl ? `font-sans-${language || 'ar'} ` : ''
                }font-sans text-sm md:text-sm mb-0 md:mb-0`}
                style={{
                  color: UNDPColorModule[mode].grays.black,
                }}
              >
                {rtl ? (language === 'he' ? 'לא זמין' : 'غير متوفر') : 'NA'}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
