import { A } from '@undp-data/undp-design-system-react';
import { SourcesDataType } from '../../Types';
import { UNDPColorModule } from '../ColorPalette';

interface SourceProps {
  sources: SourcesDataType[];
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
}

export function Source(props: SourceProps) {
  const { sources, rtl, language, mode } = props;
  return (
    <p
      className={`${
        rtl ? `font-sans-${language || 'ar'} text-right` : 'font-sans text-left'
      } text-sm md:text-sm mb-0 m-0 md:mb-0 md:m-0`}
      style={{
        color: UNDPColorModule[mode].grays['gray-600'],
      }}
      aria-label='Data sources'
    >
      {rtl ? (
        <>
          {sources.map((d, i) => (
            <span
              key={i}
              className='text-sm md:text-sm'
              style={{
                color: UNDPColorModule[mode].grays['gray-600'],
                fontFamily: 'inherit',
              }}
            >
              {d.link ? (
                <A
                  className='text-sm md:text-sm'
                  style={{
                    color: UNDPColorModule[mode].grays['gray-600'],
                    fontFamily: 'inherit',
                  }}
                  href={d.link}
                  target='_blank'
                  rel='noreferrer'
                >
                  {d.source}
                </A>
              ) : (
                d.source
              )}
            </span>
          ))}{' '}
          :
          {language === 'he'
            ? 'מָקוֹר'
            : language === 'en'
            ? 'Source'
            : 'المصدر'}
        </>
      ) : (
        <>
          Source:{' '}
          {sources.map((d, i) => (
            <span
              key={i}
              className='text-sm md:text-sm'
              style={{
                color: UNDPColorModule[mode].grays['gray-600'],
                fontFamily: 'inherit',
              }}
            >
              {d.link ? (
                <A
                  className='text-sm md:text-sm'
                  style={{
                    color: UNDPColorModule[mode].grays['gray-600'],
                    fontFamily: 'inherit',
                  }}
                  href={d.link}
                  target='_blank'
                  rel='noreferrer'
                >
                  {d.source}
                </A>
              ) : (
                d.source
              )}
            </span>
          ))}
        </>
      )}
    </p>
  );
}
