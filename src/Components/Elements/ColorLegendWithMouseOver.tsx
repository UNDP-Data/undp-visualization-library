import { P } from '@undp-data/undp-design-system-react';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  colors: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  showNAColor: boolean;
  setSelectedColor: (_d?: string) => void;
  width?: number;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  isCenter?: boolean;
  mode: 'dark' | 'light';
}

export function ColorLegendWithMouseOver(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    setSelectedColor,
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
            size='sm'
            marginBottom='xs'
            className={`${
              language === 'en' || !rtl
                ? 'font-sans'
                : `font-sans-${language || 'ar'}`
            } ${isCenter ? 'text-center' : rtl ? 'text-right' : 'text-left'}`}
          >
            {colorLegendTitle}
          </P>
        ) : null}
        <div
          className={`flex flex-wrap gap-3.5 mb-0 ${
            rtl ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {colorDomain.map((d, i) => (
            <div
              className={`flex items-center gap-1 ${
                rtl ? 'flex-row-reverse' : 'flex-row'
              } cursor-pointer`}
              key={i}
              onMouseEnter={() => {
                setSelectedColor(colors[i % colors.length]);
              }}
              onMouseLeave={() => {
                setSelectedColor(undefined);
              }}
            >
              <div
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: colors[i % colors.length],
                }}
              />
              {d === '' ? null : (
                <P
                  size='sm'
                  marginBottom='none'
                  className={
                    language === 'en' || !rtl
                      ? 'font-sans'
                      : `font-sans-${language || 'ar'}`
                  }
                >
                  {d}
                </P>
              )}
            </div>
          ))}
          {showNAColor ? (
            <div
              onMouseEnter={() => {
                setSelectedColor(UNDPColorModule[mode].graphGray);
              }}
              onMouseLeave={() => {
                setSelectedColor(undefined);
              }}
              className={`flex items-center gap-1 ${
                rtl ? 'flex-row-reverse' : 'flex-row'
              } cursor-pointer`}
            >
              <div
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: UNDPColorModule[mode].graphGray,
                }}
              />
              <P
                size='sm'
                marginBottom='xs'
                className={
                  language === 'en' || !rtl
                    ? 'font-sans'
                    : `font-sans-${language || 'ar'}`
                }
              >
                {rtl ? (language === 'he' ? 'לא זמין' : 'غير متوفر') : 'NA'}
              </P>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
