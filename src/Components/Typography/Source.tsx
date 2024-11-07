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
        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
      }undp-viz-typography`}
      style={{
        color: UNDPColorModule[mode || 'light'].grays['gray-600'],
        fontSize: '0.875rem',
        marginBottom: 0,
        textAlign: rtl ? 'right' : 'left',
      }}
      aria-label='Data sources'
    >
      {rtl ? (
        <>
          {sources.map((d, i) => (
            <span
              key={i}
              style={{
                color: UNDPColorModule[mode || 'light'].grays['gray-600'],
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            >
              {d.link ? (
                <a
                  className='undp-viz-style'
                  style={{
                    color: UNDPColorModule[mode || 'light'].grays['gray-600'],
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                  href={d.link}
                  target='_blank'
                  rel='noreferrer'
                >
                  {d.source}
                </a>
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
              style={{
                color: UNDPColorModule[mode || 'light'].grays['gray-600'],
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
            >
              {d.link ? (
                <a
                  className='undp-viz-style'
                  style={{
                    color: UNDPColorModule[mode || 'light'].grays['gray-600'],
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                  }}
                  href={d.link}
                  target='_blank'
                  rel='noreferrer'
                >
                  {d.source}
                </a>
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
