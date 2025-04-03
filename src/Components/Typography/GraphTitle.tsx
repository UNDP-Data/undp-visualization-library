import { cn, H5, P } from '@undp-data/undp-design-system-react';
import { extractInnerString } from '@/Utils/extractInnerString';

interface Props {
  text: string;
  isDashboard?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export function GraphTitle(props: Props) {
  const { text, isDashboard, style, className } = props;
  if (extractInnerString(text)) {
    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: extractInnerString(text) as string,
        }}
        className={className}
      />
    );
  }
  if (isDashboard)
    return (
      <H5
        marginBottom='base'
        className={cn(
          'font-bold pb-3 text-primary-black dark:text-primary-gray-100',
          className,
        )}
        aria-label='Dashboard title'
        style={style}
      >
        {text}
      </H5>
    );
  return (
    <P
      marginBottom='none'
      className={cn('text-primary-black dark:text-primary-gray-100', className)}
      aria-label='Graph title'
      style={style}
    >
      {text}
    </P>
  );
}
