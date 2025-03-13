import { P } from '@undp-data/undp-design-system-react';
import { extractInnerString } from '../../Utils/extractInnerString';

interface Props {
  text: string;
}

export function GraphDescription(props: Props) {
  const { text } = props;
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
      className='text-primary-gray-550 dark:text-primary-gray-400'
      aria-label='Graph description'
    >
      {text}
    </P>
  );
}
