import { P } from '@undp-data/undp-design-system-react';
import { extractInnerString } from '../../Utils/extractInnerString';
import { UNDPColorModule } from '../ColorPalette';

interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  mode: 'dark' | 'light';
}

export function GraphDescription(props: Props) {
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
    <P
      className={`${
        rtl ? `font-sans-${language || 'ar'} text-right` : 'font-sans text-left'
      } text-sm md:text-sm mb-0 md:mb-0 m-0 md:m-0`}
      style={{
        color: UNDPColorModule[mode].grays['gray-600'],
      }}
      aria-label='Graph description'
    >
      {text}
    </P>
  );
}
