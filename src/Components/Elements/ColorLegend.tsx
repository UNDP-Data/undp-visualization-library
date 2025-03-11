import { P } from '@undp-data/undp-design-system-react';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  colors: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  showNAColor: boolean;
  width?: number;
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
    isCenter,
    mode,
  } = props;

  return (
    <div
      className={`flex ${isCenter ? 'justify-center' : ''} leading-0`}
      style={{
        maxWidth: width ? `${width}px` : 'none',
      }}
      aria-label='Color legend'
    >
      <div className={mode || 'light'}>
        {colorLegendTitle && colorLegendTitle !== '' ? (
          <P
            size='sm'
            marginBottom='2xs'
            className={isCenter ? 'text-center' : ''}
          >
            {colorLegendTitle}
          </P>
        ) : null}
        <div
          className='flex flex-wrap mb-0'
          style={{
            gap: '0.875rem',
          }}
        >
          {colorDomain.map((d, i) => (
            <div key={i} className='flex items-center gap-1'>
              <div
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: colors[i % colors.length],
                }}
              />
              {d === '' ? null : (
                <P size='sm' marginBottom='none'>
                  {d}
                </P>
              )}
            </div>
          ))}
          {showNAColor ? (
            <div className='flex items-center gap-1'>
              <div
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: UNDPColorModule.gray,
                }}
              />
              <P size='sm' marginBottom='none'>
                NA
              </P>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
