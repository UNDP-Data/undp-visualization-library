import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
}

export function GraphDescription(props: Props) {
  const { text, rtl, language, mode } = props;
  return (
    <p
      className={`${
        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
      }undp-viz-typography`}
      style={{
        color: UNDPColorModule[mode || 'light'].grays['gray-600'],
        marginBottom: 0,
        fontSize: '0.875rem',
        textAlign: rtl ? 'right' : 'left',
      }}
    >
      {text}
    </p>
  );
}
