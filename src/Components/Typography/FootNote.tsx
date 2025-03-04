import { P } from '@undp-data/undp-design-system-react';
import { extractInnerString } from '../../Utils/extractInnerString';

interface Props {
  text: string;
  rtl?: boolean;
  language?: 'ar' | 'he' | 'en';
}

export function FootNote(props: Props) {
  const { text, rtl, language } = props;
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
      size='sm'
      marginBottom='none'
      fontType={language === 'en' || !rtl ? 'body' : language || 'ar'}
      className={`text-primary-gray-600 dark:text-primary-gray-400 ${
        rtl ? 'text-right' : 'text-left'
      }`}
      aria-label='Graph footnote'
    >
      {text}
    </P>
  );
}
