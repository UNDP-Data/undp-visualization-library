import { cn, P } from '@undp-data/undp-design-system-react';
import { extractInnerString } from '../../Utils/extractInnerString';
import { CSSObject } from '../../Types';

interface Props {
  text: string;
  style?: CSSObject;
  className?: string;
}

export function FootNote(props: Props) {
  const { text, style = {}, className } = props;
  if (extractInnerString(text)) {
    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: extractInnerString(text) as string,
        }}
        className={className}
        style={style}
      />
    );
  }
  return (
    <P
      size='sm'
      marginBottom='none'
      className={cn(
        'text-primary-gray-550 dark:text-primary-gray-40',
        className,
      )}
      aria-label='Graph footnote'
      style={style}
    >
      {text}
    </P>
  );
}
