import { A, P } from '@undp-data/undp-design-system-react';
import { SourcesDataType } from '../../Types';

interface SourceProps {
  sources: SourcesDataType[];
}

export function Source(props: SourceProps) {
  const { sources } = props;
  return (
    <P size='sm' marginBottom='none' aria-label='Data sources'>
      Source:{' '}
      {sources.map((d, i) => (
        <span
          key={i}
          className='text-primary-gray-600 dark:text-primary-gray-400'
          style={{
            fontFamily: 'inherit',
          }}
        >
          {d.link ? (
            <A
              className='text-primary-gray-600 dark:text-primary-gray-400'
              href={d.link}
              target='_blank'
              rel='noreferrer'
            >
              {d.source}
            </A>
          ) : (
            d.source
          )}
        </span>
      ))}
    </P>
  );
}
