interface SourceProps {
  text: string;
  link?: string;
}

export function Source(props: SourceProps) {
  const { text, link } = props;
  return (
    <p
      className='undp-typography margin-bottom-00'
      style={{
        color: 'var(--gray-500)',
        fontSize: '0.875rem',
      }}
    >
      Source:{' '}
      {link ? (
        <a
          className='undp-style'
          style={{ color: 'var(--gray-500)' }}
          href={link}
          target='_blank'
          rel='noreferrer'
        >
          {text}
        </a>
      ) : (
        text
      )}
    </p>
  );
}
