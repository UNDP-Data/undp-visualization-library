import { cn, P } from '@undp-data/undp-design-system-react';
import { extractInnerString } from '@/Utils/extractInnerString';

interface Props {
  text: string;
  style?: React.CSSProperties;
  className?: string;
}

export function GraphDescription(props: Props) {
  const { text, style, className } = props;
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
        'text-primary-gray-550 dark:text-primary-gray-400',
        className,
      )}
      aria-label='Graph description'
      style={style}
    >
      {text}
    </P>
  );
}
