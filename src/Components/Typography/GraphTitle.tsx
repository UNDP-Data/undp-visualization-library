import { H5, P } from '@undp-data/undp-design-system-react';
import { extractInnerString } from '../../Utils/extractInnerString';

interface Props {
  text: string;
  isDashboard?: boolean;
}

export function GraphTitle(props: Props) {
  const { text, isDashboard } = props;
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
        marginBottom='base'
        className='font-bold pb-3 text-primary-gray-600 dark:text-primary-gray-400'
        aria-label='Dashboard title'
      >
        {text}
      </H5>
    );
  return (
    <P
      marginBottom='none'
      className='text-primary-gray-600 dark:text-primary-gray-400'
      aria-label='Graph title'
    >
      {text}
    </P>
  );
}
