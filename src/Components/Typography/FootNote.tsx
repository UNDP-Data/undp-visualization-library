import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
}

export function FootNote(props: Props) {
  const { text, rtl, language } = props;
  return (
    <p
      className={`${
        rtl ? `undp-viz-typography-${language || 'ar'} ` : ''
      }undp-viz-typography`}
      style={{
        color: UNDPColorModule.grays['gray-600'],
        fontSize: '0.875rem',
        marginBottom: 0,
        textAlign: rtl ? 'right' : 'left',
      }}
    >
      {text}
    </p>
  );
}
