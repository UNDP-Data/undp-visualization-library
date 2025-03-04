import { H5, P } from '@undp-data/undp-design-system-react';
import { extractInnerString } from '../../Utils/extractInnerString';

interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
  isDashboard?: boolean;
}

export function GraphTitle(props: Props) {
  const { text, rtl, language, isDashboard } = props;
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
        marginBottom='lg'
        fontType={language === 'en' || !rtl ? 'body' : language || 'ar'}
        className={`font-bold pb-3 md:pb-3 text-primary-gray-600 dark:text-primary-gray-400 ${
          rtl ? 'text-right' : 'text-left'
        }`}
        aria-label='Dashboard title'
      >
        {text}
      </H5>
    );
  return (
    <P
      marginBottom='none'
      fontType={language === 'en' || !rtl ? 'body' : language || 'ar'}
      className={`text-primary-gray-600 dark:text-primary-gray-400 ${
        rtl ? 'text-right' : 'text-left'
      }`}
      aria-label='Graph title'
    >
      {text}
    </P>
  );
}
