import { UNDPColorModule } from '../ColorPalette';

interface SourceProps {
  text: string;
  link?: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
}

export function Source(props: SourceProps) {
  const { text, link, rtl, language, mode } = props;
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
    >
      {rtl ? (
        <>
          {link ? (
            <a
              className='undp-viz-style'
              style={{
                color: UNDPColorModule[mode || 'light'].grays['gray-600'],
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
              href={link}
              target='_blank'
              rel='noreferrer'
            >
              {text}
            </a>
          ) : (
            text
          )}{' '}
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
          {link ? (
            <a
              className='undp-viz-style'
              style={{
                color: UNDPColorModule[mode || 'light'].grays['gray-600'],
                fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}
              href={link}
              target='_blank'
              rel='noreferrer'
            >
              {text}
            </a>
          ) : (
            text
          )}
        </>
      )}
    </p>
  );
}
