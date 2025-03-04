import { A, P } from '@undp-data/undp-design-system-react';
import { SourcesDataType } from '../../Types';

interface SourceProps {
  sources: SourcesDataType[];
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
}

export function Source(props: SourceProps) {
  const { sources, rtl, language } = props;
  return (
    <P
      size='sm'
      marginBottom='none'
      fontType={language === 'en' || !rtl ? 'body' : language || 'ar'}
      className={`text-primary-gray-600 dark:text-primary-gray-400 ${
        rtl ? 'text-right' : 'text-left'
      }`}
      aria-label='Data sources'
    >
      {rtl ? (
        <>
          {sources.map((d, i) => (
            <span
              key={i}
              className='text-sm md:text-sm text-primary-gray-600 dark:text-primary-gray-400'
              style={{
                fontFamily: 'inherit',
              }}
            >
              {d.link ? (
                <A
                  className='text-sm md:text-sm text-primary-gray-600 dark:text-primary-gray-400'
                  style={{
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
              className='text-sm md:text-sm text-primary-gray-600 dark:text-primary-gray-400'
              style={{
                fontFamily: 'inherit',
              }}
            >
              {d.link ? (
                <A
                  className='text-sm md:text-sm text-primary-gray-600 dark:text-primary-gray-400'
                  style={{
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
    </P>
  );
}
