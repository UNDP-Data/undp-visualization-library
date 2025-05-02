import { cn, P } from '@undp/design-system-react';

import { Colors } from '@/Components/ColorPalette';

interface Props {
  colors: string[];
  colorDomain: (string | number)[];
  colorLegendTitle?: string;
  showNAColor: boolean;
  width?: number;
  isCenter?: boolean;
  className?: string;
}

export function ColorLegend(props: Props) {
  const { colorLegendTitle, colorDomain, colors, showNAColor, width, isCenter, className } = props;

  return (
    <div
      className={cn('flex leading-0', isCenter && 'justify-center', className)}
      style={{ maxWidth: width ? `${width}px` : 'none' }}
      aria-label='Color legend'
    >
      <div>
        {colorLegendTitle && colorLegendTitle !== '' ? (
          <P size='sm' marginBottom='2xs' className={isCenter ? 'text-center' : ''}>
            {colorLegendTitle}
          </P>
        ) : null}
        <div className='flex flex-wrap mb-0 gap-3.5'>
          {colorDomain.map((d, i) => (
            <div key={i} className='flex items-center gap-1'>
              <div
                className='w-3 h-3 rounded-full'
                style={{ backgroundColor: colors[i % colors.length] }}
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
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: Colors.gray }} />
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
