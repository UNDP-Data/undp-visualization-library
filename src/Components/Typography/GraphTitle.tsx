import { extractInnerString } from '../../Utils/extractInnerString';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
  isDashboard?: boolean;
}

export function GraphTitle(props: Props) {
  const { text, rtl, language, mode, isDashboard } = props;
  if (extractInnerString(text)) {
    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: extractInnerString(text) as string,
        }}
      />
    );
  }
  if (isDashboard)
    return (
      <h5
        className={`${
          rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
        }undp-viz-typography`}
        style={{
          marginBottom: '1rem',
          fontWeight: 'bold',
          paddingBottom: '0.75rem',
          textAlign: rtl ? 'right' : 'left',
          color: UNDPColorModule[mode].grays.black,
        }}
        aria-label='Dashboard title'
      >
        {text}
      </h5>
    );
  return (
    <p
      className={`${
        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
      }undp-viz-typography`}
      style={{
        marginBottom: 0,
        textAlign: rtl ? 'right' : 'left',
        color: UNDPColorModule[mode].grays.black,
      }}
      aria-label='Graph title'
    >
      {text}
    </p>
  );
}
