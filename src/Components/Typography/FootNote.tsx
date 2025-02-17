import { extractInnerString } from '../../Utils/extractInnerString';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
}

export function FootNote(props: Props) {
  const { text, rtl, language, mode } = props;
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
  return (
    <p
      className={`${
        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
      }undp-viz-typography`}
      style={{
        color: UNDPColorModule[mode].grays['gray-600'],
        fontSize: '0.875rem',
        marginBottom: 0,
        textAlign: rtl ? 'right' : 'left',
      }}
      aria-label='Graph footnote'
    >
      {text}
    </p>
  );
}
