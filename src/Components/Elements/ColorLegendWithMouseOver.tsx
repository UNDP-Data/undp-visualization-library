import { P } from '@undp-data/undp-design-system-react';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  colors: string[];
  colorDomain: string[];
  colorLegendTitle?: string;
  showNAColor: boolean;
  setSelectedColor: (_d?: string) => void;
  width?: number;
  isCenter?: boolean;
}

export function ColorLegendWithMouseOver(props: Props) {
  const {
    colorLegendTitle,
    colorDomain,
    colors,
    setSelectedColor,
    showNAColor,
    width,
    isCenter,
  } = props;

  return (
    <div
      className={`flex ${isCenter ? 'justify-center' : ''} leading-0`}
      style={{
        maxWidth: width ? `${width}px` : 'none',
      }}
      aria-label='Color legend'
    >
      <div>
        {colorLegendTitle && colorLegendTitle !== '' ? (
          <P
            size='sm'
            marginBottom='2xs'
            className={isCenter ? 'text-center' : ''}
          >
            {colorLegendTitle}
          </P>
        ) : null}
        <div className='flex flex-wrap gap-3.5 mb-0'>
          {colorDomain.map((d, i) => (
            <div
              className='flex items-center gap-1 cursor-pointer'
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
                <P size='sm' marginBottom='none'>
                  {d}
                </P>
              )}
            </div>
          ))}
          {showNAColor ? (
            <div
              onMouseEnter={() => {
                setSelectedColor(UNDPColorModule.gray);
              }}
              onMouseLeave={() => {
                setSelectedColor(undefined);
              }}
              className='flex items-center gap-1 cursor-pointer'
            >
              <div
                className='w-3 h-3 rounded-full'
                style={{
                  backgroundColor: UNDPColorModule.gray,
                }}
              />
              <P size='sm' marginBottom='2xs'>
                NA
              </P>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
