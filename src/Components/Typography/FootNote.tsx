import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
}

export function FootNote(props: Props) {
  const { text, rtl, language, mode } = props;
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
      aria-label='Graph footnote'
    >
      {text}
    </p>
  );
}
