import { H5, P } from '@undp-data/undp-design-system-react';
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
      <H5
        className={`${
          rtl
            ? `font-sans-${language || 'ar'} text-right`
            : 'font-sans text-left'
        } mb-4 md:mb-4 font-bold pb-3 md:pb-3`}
        style={{
          color: UNDPColorModule[mode].grays.black,
        }}
        aria-label='Dashboard title'
      >
        {text}
      </H5>
    );
  return (
    <P
      className={`${
        rtl ? `font-sans-${language || 'ar'} text-right` : 'font-sans text-left'
      } mb-0 md:mb-0`}
      style={{
        color: UNDPColorModule[mode].grays.black,
      }}
      aria-label='Graph title'
    >
      {text}
    </P>
  );
}
